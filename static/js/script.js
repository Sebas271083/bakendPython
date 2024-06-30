
// // Cargar la plantilla de navbar usando JavaScript
// window.addEventListener('DOMContentLoaded', () => {
//     const navbarPlaceholder = document.getElementById('navbar-placeholder');
//     navbarPlaceholder.innerHTML = '<object type="text/html" data="navbar.html" ></object>';
// });



document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });
});


const btnDesplegable = document.querySelector("#btn-desplegable")
const desplegable = document.querySelector("#desplegable")

btnDesplegable.addEventListener('click', ()=>{
    console.log(desplegable.style.display)
    if(desplegable.style.display == "none") {
        desplegable.style.display = "block"
    } else {
        desplegable.style.display = "none"
    }
})




const productos = [
    { id: "1", titulo: "Producto 1", descripcion: "Descripción del producto 1.", imagen: "./img/florero.jpeg", precio: "$10" },
    { id: "2", titulo: "Producto 2", descripcion: "Descripción del producto 2.", imagen: "./img/florero2.jpeg", precio: "$15" },
    { id: "3", titulo: "Producto 2", descripcion: "Descripción del producto 2.", imagen: "./img/veladorLuna.jpeg", precio: "$15" },
    { id: "4", titulo: "Producto 2", descripcion: "Descripción del producto 2.", imagen: "./img/veladorLuna.jpeg", precio: "$15" },
    { id: "5", titulo: "Producto 2", descripcion: "Descripción del producto 2.", imagen: "./img/veladorLuna.jpeg", precio: "$15" },
    { id: "6", titulo: "Producto 2", descripcion: "Descripción del producto 2.", imagen: "./img/veladorLuna.jpeg", precio: "$15" },
    { id: "7", titulo: "Producto 2", descripcion: "Descripción del producto 2.", imagen: "./img/veladorLuna.jpeg", precio: "$15" },
    { id: "8", titulo: "Producto 2", descripcion: "Descripción del producto 2.", imagen: "./img/veladorLuna.jpeg", precio: "$15" },
    { id: "9", titulo: "Producto 2", descripcion: "Descripción del producto 2.", imagen: "./img/veladorLuna.jpeg", precio: "$15" },
    { id: "10", titulo: "Producto 2", descripcion: "Descripción del producto 2.", imagen: "./img/veladorLuna.jpeg", precio: "$15" },
    { id: "11", titulo: "Producto 2", descripcion: "Descripción del producto 2.", imagen: "./img/veladorLuna.jpeg", precio: "$15" },
    { id: "12", titulo: "Producto 2", descripcion: "Descripción del producto 2.", imagen: "./img/veladorLuna.jpeg", precio: "$15" },
    { id: "13", titulo: "Producto 2", descripcion: "Descripción del producto 2.", imagen: "./img/veladorLuna.jpeg", precio: "$15" },

];

// Función para generar las tarjetas de producto
function generarTarjetas() {
    const cardContainer = document.getElementById("card-container");

    productos.forEach(producto => {
        // Crear elementos HTML para la tarjeta de producto
        const card = document.createElement("div");
        card.classList.add("card");

        const imagen = document.createElement("img");
        imagen.src = producto.imagen;
        imagen.alt = producto.titulo;
        imagen.classList.add("imagenProducto" + producto.id);

        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");

        const titulo = document.createElement("h2");
        titulo.textContent = producto.titulo;
        titulo.classList.add(`nombreProducto${producto.id}`);

        const descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion;

        const precio = document.createElement("p");
        precio.id = "precioProducto";
        precio.textContent = `Precio: ${producto.precio}`;

        const boton = document.createElement("button");
        boton.id = "btn-" + producto.id;
        boton.setAttribute("data-id", producto.id);
        boton.textContent = "Agregar al Carrito";

        const contenedorBotones = document.createElement("div");
        contenedorBotones.id = "contenedor-btn" + producto.id;
        contenedorBotones.style.display = "flex";
        contenedorBotones.style.justifyContent = "center";
        contenedorBotones.style.alignItems = "end";
        contenedorBotones.style.display = "none";

        const botonMas = document.createElement("button");
        botonMas.classList.add("btn-mas");
        botonMas.textContent = "+";
        botonMas.style.height = "30px";
        botonMas.style.marginTop = "20px";
        botonMas.style.marginRight = "10px";

        const cantidad = document.createElement("input");
        cantidad.classList.add("cantidad");
        cantidad.value = 0;
        cantidad.style.width = "40px";
        cantidad.style.height = "20px";
        cantidad.style.textAlign = "center";

        const botonMenos = document.createElement("button");
        botonMenos.classList.add("btn-menos");
        botonMenos.type = "button";
        botonMenos.style.height = "30px";
        botonMenos.style.marginTop = "20px";
        botonMenos.style.marginLeft = "10px";
        botonMenos.textContent = "-";

        contenedorBotones.appendChild(botonMenos);
        contenedorBotones.appendChild(cantidad);
        contenedorBotones.appendChild(botonMas);

        cardContent.appendChild(titulo);
        cardContent.appendChild(descripcion);
        cardContent.appendChild(precio);
        cardContent.appendChild(boton);
        cardContent.appendChild(contenedorBotones);

        card.appendChild(imagen);
        card.appendChild(cardContent);

        if (cardContainer) {
            cardContainer.appendChild(card);
        }
    });

    // Asignar eventos a los botones después de generarlos
    setTimeout(() => {
        document.querySelectorAll('.btn-menos').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cantidad = e.target.parentElement.querySelector('.cantidad');
                if (cantidad.value > 0) {
                    cantidad.value = parseInt(cantidad.value) - 1;
                }
            });
        });

        document.querySelectorAll('.btn-mas').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cantidad = e.target.parentElement.querySelector('.cantidad');
                cantidad.value = parseInt(cantidad.value) + 1;
            });
        });

        document.querySelectorAll('button[id^="btn-"]').forEach(boton => {
            boton.addEventListener('click', function () {
                agregarAlCarrito(this.getAttribute('data-id'), "3");
            });
        });
    }, 100);
}

// Llamar a la función para generar las tarjetas al cargar la página
window.addEventListener('DOMContentLoaded', generarTarjetas);

function agregarAlCarrito(productoId) {
    const contenedorBotones = document.querySelector(`#contenedor-btn${productoId}`);
    contenedorBotones.style.display = "flex";

    const imgProducto = document.querySelector(`.imagenProducto${productoId}`);
    const nombreProducto = document.querySelector(`.nombreProducto${productoId}`);
    const btnAgregar = document.querySelector(`#btn-${productoId}`);

    btnAgregar.textContent = "Producto Agregado";
    btnAgregar.style.backgroundColor = "green";

    const productoObj = {
        imagen: imgProducto.src,
        nombre: nombreProducto.textContent,
        precio: "16000"
    };

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(productoObj);

    const contadorCarrito = document.querySelector("#contadorCarrito");
    contadorCarrito.innerText = carrito.length;

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

document.addEventListener('DOMContentLoaded', function () {
    const currentUrl = "." + window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        let linkCompleto = './impresiones3d' + link.getAttribute('href').replace(/^\./, '');
        if (linkCompleto === currentUrl) {
            link.classList.add('active');
        }
    });
});

function animarElementoOnScroll() {
    const elemento = document.querySelector('.content-servicios');
    const distanciaDesdeLaParteSuperior = elemento.getBoundingClientRect().top;

    if (distanciaDesdeLaParteSuperior < window.innerHeight / 2) {
        elemento.classList.add('animate__animated', 'animate__slideInUp');
        setTimeout(() => {
            elemento.style.display = "flex";
        }, 100);
    }
}

window.addEventListener('scroll', animarElementoOnScroll);

const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

document.addEventListener('DOMContentLoaded', function () {
    consultarApi('ciudad autonoma de buenos aires', 'Argentina');
});

function consultarApi(ciudad, pais) {
    const appId = '4a82dce44d60f84db126afbe6d3fd1da';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.cod === "404") {
                mostarError('Ciudad no encontrada');
                return;
            }
            mostrarClima(datos);
        });
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min } } = datos;
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451; `;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);



document.addEventListener('DOMContentLoaded', function () {
    const currentUrl = "." + window.location.pathname;
    console.log("currentUrl", currentUrl)

    const navLinks = document.querySelectorAll('nav ul li a');



    navLinks.forEach(link => {
        let linkCompleto = './impresiones3d' + link.getAttribute('href').replace(/^\./, '');
        console.log("linkCompleto ", linkCompleto)


        if (linkCompleto === currentUrl) {
            link.classList.add('active');
        }
    });
});


//Carrito

    const contadorCarrito = document.querySelector("#contadorCarrito")
    let contador = 0;



    setTimeout(() => {
        document.querySelectorAll('button').forEach(boton => {
        console.log("BOTON")
        boton.addEventListener('click', function () {
            agregarAlCarrito(this.getAttribute('data-id'), 1);
        });
    });

    }, 100);
    



    function agregarAlCarrito(productoId, cantidad) {

        let imgProducto;
        let nombreProducto
        contenedorBotones = document.querySelector(`#contenedor-btn${productoId}`)
        console.log("contenedorBotones", contenedorBotones)
        contenedorBotones.style.display = "flex"

        imgProducto = document.querySelector(`.imagenProducto${productoId}`)
        console.log("imgCarrera", imgProducto.src)
        nombreProducto = document.querySelector(`.nombreProducto${productoId}`)
        console.log("nombreCarrera ", nombreProducto.textContent)
        
        const btnAgregar = document.querySelector(`#btn-${productoId}`)

        btnAgregar.textContent = "Producto Agregado"
        btnAgregar.style.backgroundColor = "green"


        const productoObj = {
            id: productoId,
            imagen: imgProducto.src,
            nombre: nombreProducto.textContent,
            precio: "16000",
            cantidad: cantidad
            // precio: precioCarrera
        };


        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
       
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(producto => producto.id === productoId);

        if (!productoExistente) {
             // Agregar el producto al carrito
            carrito.push(productoObj);

            contador = carrito.length;
            contadorCarrito.innerText = contador
    
            // Guardar el carrito actualizado en el localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));
        }
      
    }

    // window.addEventListener('load', function () {
    //     const btnAgregarAlCarrito = document.querySelector("#agregarAlCarrito");
    //     console.log("btnAgregarAlCarrito ", btnAgregarAlCarrito);
    //     btnAgregarAlCarrito.addEventListener('click', agregarAlCarrito);

    //     const btnAgregarCarrito = document.getElementById('agregarCarritoBtn');
    //     btnAgregarCarrito.addEventListener('click', agregarAlCarrito);

    // });
    

    // const btnAgregarCarrito = document.getElementById('agregarCarritoBtn')
    // btnAgregarCarrito.addEventListener('click', agregarAlCarrito);

