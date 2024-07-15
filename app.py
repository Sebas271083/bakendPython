from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL
import os
import uuid
import bcrypt
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
app.secret_key = 'supersecreto'

# Configuración de la conexión a la base de datos
app.config['MYSQL_HOST'] = os.getenv('DATABASE_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD') 
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

# Configuración de la carpeta de subida (debes definirla)
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), 'static/images'))
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

mysql = MySQL(app)


def hash_password(password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password.decode('utf-8')

def verify_password(stored_password, provided_password):
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password.encode('utf-8'))


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if 'user_id' in session:
            return func(*args, **kwargs)
        else:
            return redirect(url_for('login'))
    return wrapper



@app.route('/')
def index():
    try:
        # Realiza la consulta a la base de datos
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM productos")
        data = cur.fetchall()
        app.logger.info("Datos obtenidos correctamente: %s", data)
        cur.close()
        return render_template('index.html', data=data)
    except Exception as e:
        return str(e)
    
    
    
@app.route('/crear-usuario', methods=['GET', 'POST'])
def crearUsuario():
    if request.method == 'POST':
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        password = request.form['password']

        # Verificar si el usuario ya existe
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM usuarios WHERE nombre = %s", (nombre,))
        user = cur.fetchone()

        if user:
            return render_template('crear_usuario.html', error='El usuario ya existe')
        
        hashed_password = hash_password(password)
        print(hashed_password)
        cur.execute("INSERT INTO usuarios (nombre, apellido, password) VALUES (%s, %s, %s)", (nombre, apellido, hashed_password))
        mysql.connection.commit()
        cur.close()
        return redirect(url_for('login'))
    
    return render_template('crearUsuario.html')
    

@app.route('/login',  methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, nombre, apellido, password FROM usuarios WHERE nombre = %s", (username,))
        user = cur.fetchone()
        print("User_____", user)
        
        if user and verify_password(user[3], password):
        # if user:
            session['user_id'] = user[0]  # Iniciar sesión del usuario
            return redirect(url_for('productosAdmin'))
        else:
            return render_template('login.html', error='Credenciales incorrectas')
        
        
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))

@app.route('/crear-producto', methods=['GET', 'POST'])
@login_required
def crear():
    if request.method == 'POST':
        nombre = request.form['nombre']
        descripcion = request.form['descripcion']
        categoria = int(request.form['categoria'])
        precio = request.form['precio']

        if 'imagen' not in request.files:
            return redirect(request.url)

        file = request.files['imagen']
        if file.filename == '':
            return redirect(request.url)

        if file:
            # Crear el directorio si no existe
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])

            # Generar un nombre único para la imagen
            filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            # Guardar los datos del producto en la base de datos
            try:
                cur = mysql.connection.cursor()
                cur.execute(
                    "INSERT INTO productos (nombre, descripcion, id_categoria, precio, imagen) VALUES (%s, %s, %s, %s, %s)", 
                    (nombre, descripcion, categoria, precio, filename)
                )
                mysql.connection.commit()
                cur.close()

                return redirect(url_for('index'))  
            except Exception as e:
                print("Error al insertar en la base de datos:", e)
                return redirect(request.url)            
    return render_template('crear.html')

@app.route('/productos/editar/<int:id>', methods=['GET', 'POST'])
@login_required
def editarProducto(id):
    if request.method == 'POST':
        nombre = request.form['nombre']
        descripcion = request.form['descripcion']
        categoria = request.form['categoria']
        precio = request.form['precio']
        
    cur = mysql.connection.cursor()
    try:    
        if 'imagen' in request.files:
            file = request.files['imagen']
            if file.filename != '':
                # Guardar la nueva imagen con un nombre único
                filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
            else:
                # Conservar la imagen existente si no se cambia la imagen3
                
                cur.execute("SELECT imagen FROM productos WHERE id = %s", (id,))
                producto = cur.fetchone()
                print("Producto::::::", producto)
                filename = producto[0]  # Obtener el nombre de imagen existente
        else:
            # Conservar la imagen existente si no se proporciona ninguna imagen nueva
            cur.execute("SELECT imagen FROM productos WHERE id = %s", (id,))
            producto = cur.fetchone()
            print("Producto::::::", producto)
            filename = producto[0]

        cur.execute(
            "UPDATE productos SET nombre=%s, descripcion=%s, id_categoria=%s, precio=%s, imagen=%s WHERE id=%s",
            (nombre, descripcion, categoria, precio, filename, id)
        )
        mysql.connection.commit()
        cur.close()

        return redirect(url_for('productosAdmin'))
    except Exception as e:
            print(f"Error al actualizar el producto: {e}")
    finally:
            cur.close()
    
    
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, nombre, descripcion, id_categoria, precio, imagen FROM productos WHERE id = %s", (id,))
    producto = cur.fetchone()
    cur.close()
    return render_template('editarProductos.html', producto=producto)

def obtener_productos():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM productos WHERE estado = 0")
        data = cur.fetchall()
        app.logger.info("Datos obtenidos correctamente: %s", data)
        cur.close()
        return data
    except Exception as e:
        app.logger.error("Error al obtener datos: %s", e)
        return None

@app.route('/productos')
def productos():
    data = obtener_productos()
    if data is not None:
        return render_template('productos.html', data=data)
    else:
        return "Error al obtener los productos"

@app.route('/productos-admin')
@login_required
def productosAdmin():
    data = obtener_productos()
    if data is not None:
        return render_template('productosAdmin.html', data=data)
    else:
        return "Error al obtener los productos"
    
@app.route('/productos/eliminar/<int:id>', methods=['GET','POST'])
def eliminar(id):
    cur = mysql.connection.cursor()
    cur.execute(
        "UPDATE productos SET estado=%s WHERE id=%s",
        (1, id)
    )
    mysql.connection.commit()
    cur.close()
    return redirect(url_for('productosAdmin'))

if __name__ == '__main__':
    app.run(debug=True)

