// PREENTREGA

/**********
 
 DEFINO LAS CLASES DE LA APP

**********/

// Creo la clase Usuario
class Usuario{
    constructor(nombre,password){
        this.nombre=nombre;
        this.password=password;
    }
}

// Creo la clase Producto
class Producto{
    constructor(nombre,precio,stock,subtotal){
        this.nombre=nombre;
        this.precio=precio;
        this.stock=stock;
        this.subtotal=this.calcularSubTotal();
    }

    //Metodo que calcula el subtotal del articulo ingresado
    calcularSubTotal() {
        const subtotal = this.precio * this.stock;
        return subtotal;
    }

    generarDivConArticulo() {
        const linea = document.createElement("div");

        
        linea.innerHTML = `
            <span>${this.nombre}</span>
            <span>${this.precio}</span>
            <span>${this.stock}</span>
            <span>${this.subtotal}</span>
        `;

        return linea;
    }
}


/**********
 
 Fetch para traer los procutos de mi json local
 
**********/

//Funcion asincronica, puede trabajar en segundo plano sin trancar la ejecucion de la app
async function obtenerProductos(){
    fetch("/productos.json")
        .then((response) =>{
            console.log(response);
            return response.json();
        })
        .then((json)=>{
            //Igualo mi array listaProdcutos con el json local respetando la clave valor de los atibutos de el objeto prodcuto para precargar una lista de prodcutos
            listaProductos = json.map(prod => new Producto(prod.nombre, prod.precio, prod.stock));
            console.log(json);
            mostrarProductos();
        })
        .catch((error) => {
            console.error("Error al obtener los productos", error);
        });

}



/**********
 
 INICIALIZO LAS VARIABLES QUE VOY A UTILIZAR EN LA APP PARA ALMACENAR LOS DATOS EN MEMORIA

**********/


let listaUsuarios= [
    new Usuario("nani", "1234"),
    new Usuario("admin", "1234"),
];

// let listaProductos = [
//     new Producto("Camiseta", 19, 10),
//     new Producto("Zapatos", 49, 5),
//     new Producto("Pantalones", 29, 8),
//     new Producto("Sombrero", 15, 12),
//     new Producto("Bufanda", 9, 20)
// ];



obtenerProductos();
let listaProductos = [];





/**********
 
 Funcion para validar usuario

**********/

const botonLogin = document.getElementById('btnLogin');
botonLogin.addEventListener('click',validarUsuario);

function validarUsuario(e) {
    

    //Tomo los valores ingresados en el form y los asigno a las variables
    const nombreUsuario = document.getElementById("user").value;
    const passwordUsuario = document.getElementById("password").value;
    const usuarioh1 = document.getElementById("usuarioLogged");


    //Crea la bandera de salida por defecto en false
    let usuarioValido = false;

    // console.log("Usuario es "+ usuarioGuardado.nombre);
    // console.log("Password es "+ usuarioGuardado.password);

    // Itera el array de listaUsuarios
    for (const usuario of listaUsuarios) {
        if (usuario.nombre === nombreUsuario && usuario.password === passwordUsuario) {
            usuarioValido = true;
            break;
        }
    }

    // Verifica si el nombre y la pasword ingresados coinciden con alguno de los preseteados
    if (usuarioValido) {
        //Guarda el usuario validado en el local storage
        localStorage.setItem(nombreUsuario, true);
        console.log("Usuario validado y guardado en Local Storage.");

        muestraElementosOcultos();
        limpiarCampos();
        actualizarLocalStorage();
        usuarioh1.innerHTML=`Hola <b>${nombreUsuario}</b>`;
        //Muestro modal de exito al loguearse con libreria sweet alert
        Swal.fire({
            title: 'Login',
            text: 'Usted se autentico correctamente',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
        // Credenciales correctas, imprimo mensaje en el div msg
        imprimirMensaje(`<div class='bg-green-900 border-2 rounded text-green-100 p-1 px-3'>Usuario validado correctamente.</div>`);
    } else {
        // Credenciales invalidas, imprimo mensaje en el div msg
        limpiarCampos();
        
        imprimirMensaje(`<div class='bg-red-900 border-2 rounded text-red-100 p-1 px-3'>Usuario o contraseña incorrectos</div>`);

    }
    //Agrego el preventDefaul para que no recargue la pagina
    e.preventDefault();
}



/**********
 
 Funcion logout

**********/

const botonLogout = document.getElementById('btnLogout');
botonLogout.addEventListener('click',desloguear);

function desloguear(e) {
    
    const usuarioh1 = document.getElementById("usuarioLogged");
    usuarioh1.textContent="Ingrese usuario y contrasena";
    ocultaElementos();
    localStorage.clear();
    imprimirMensaje(`<div class='bg-red-900 border-2 rounded text-red-100 p-1 px-3'>Usted salio de la aplicacion</div>`);
    //Agrego el preventDefaul para que no recargue la pagina
    e.preventDefault();
    Swal.fire({
        title: 'Logout',
        text: 'Usted salio de la aplicacion',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
}


/**********
 
 Funcion para mostrar elementos

**********/

function muestraElementosOcultos(){
    const ocultos = document.querySelectorAll('.panel');
    ocultos.forEach(element => {
        element.classList.remove('hidden');
    });
    
}

/**********
 
 Funcion para ocultar elementos

**********/

function ocultaElementos(){
    const ocultos = document.querySelectorAll('.panel');
    ocultos.forEach(element => {
        element.classList.add('hidden');
    });
    
}





//Tomo los valores ingresados en el form y los asigno a las variables
const nombreProducto = document.getElementById("nombre");
const precioProducto = document.getElementById("precio");
const stockProducto = document.getElementById("stock");







mostrarProductos(); 

console.log(listaProductos);


/**********
 
 Agregar productos

**********/

const botonAgregar = document.getElementById('btnAgregar');


botonAgregar.addEventListener('click',agregarProducto);

function agregarProducto(){


    
    const producto = new Producto(
        nombreProducto.value,
        parseFloat(precioProducto.value),
        parseInt(stockProducto.value)
    );

   

    if(esNumero(producto.precio) && esNumero(producto.stock)){
        // Agrego producto a la lista
        listaProductos.push(producto);
        Swal.fire({
            title: 'Producto agregado',
            text: `El producto ${nombreProducto.value} fue agregado correctamente`,
            icon: 'success',
            confirmButtonText: 'Continuar'
          });
        //Muestro lista d eprodcutos en pantalla
        mostrarProductos();
        //Actualizo lista de prodcutos en Local Storage
        actualizarLocalStorage();
        console.log(listaProductos);
        
    }
    else{
        imprimirMensaje(`<div class='bg-red-900 border-2 rounded text-red-100 p-1 px-3'>Se deben ingresar valores numericos en precio y stock</div>`);
        
    }

    limpiarCampos();

}

/**********
 
 Imprimir mensaje

**********/

function imprimirMensaje(mensaje){
    let msg = document.getElementById('msg');
    msg.innerHTML = '';
    msg.innerHTML = mensaje;
}


/**********
 
 Quitar productos

**********/


const botonQuitar = document.getElementById('btnQuitar');

botonQuitar.addEventListener('click',quitarProducto);


function quitarProducto() {

    const nombre = document.getElementById("nombreQuitar").value.toLowerCase();
    console.log('Entró a la función quitarProducto' + nombre);

    // Guardo el tamaño actual del array listaproductos
    const productosAntes = listaProductos.length;
    
    // Filtra la lista y deja solo los productos cuyo nombre no coincide
    listaProductos = listaProductos.filter((el) => {
        return el.nombre.toLowerCase() !== nombre;
    });
    // Si el tamaño del array listaproducto cambió, un producto fue eliminado
    if(listaProductos.length < productosAntes){
        // Muestra los productos actualizados después de eliminar el producto
        mostrarProductos(); 
        limpiarCampos();
        actualizarLocalStorage();
        imprimirMensaje(`<div class='bg-green-900 border-2 rounded text-green-100 p-1 px-3'>El producto ${nombre} fue eliminado correctamente</div>`);
        Swal.fire({
            title: 'Producto eliminado',
            text: `El producto ${nombre} fue eliminado correctamente`,
            icon: 'success',
            confirmButtonText: 'Continuar'
          });
    }else{
        imprimirMensaje(`<div class='bg-red-900 border-2 rounded text-red-100 p-1 px-3'>El producto ${nombre} no se encuentra en la lista de productos</div>`);

    }

    
}


/**********
 
Funcion para mostrar el array con la lista de productos en pantalla

**********/

function mostrarProductos() {

    let divResultado = document.getElementById("resultado");

    divResultado.innerHTML = "";


    for(const producto of listaProductos) {
        divResultado.append(producto.generarDivConArticulo());
        console.log('se ejecuta mostrar prodcutos')
    }
}


/**********
 
 Limpiar inputs

**********/

function limpiarCampos(){
    
    /* Selecciono todos los inputs */
    const input = document.querySelectorAll('input');

    /* Recorro todos los inputs y les cambio su value a vacio */
    for(let i = 0; i < input.length; i++) {
            input[i].value='';
        
           console.log('borro contenido inputs al aplretar boton calcular');
        }
}

/**********
 
 Verifica que el valor sea numerico

**********/

function esNumero(valor){
    return !isNaN(parseFloat(valor));
}

/**********
 
 Ordena los productosd en orden alfabetico

**********/

const botonOrdenarAlfabeticamente = document.getElementById('btnOrdenarAlfabeticamente');

botonOrdenarAlfabeticamente.addEventListener('click',ordenarProductosPorNombreAlbabeticamente);

function ordenarProductosPorNombreAlbabeticamente() {

    listaProductos.sort((a, b) => {
        // Comparo los nombres en orden alfabético pasando to a minusculas cuando comparo
        return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
    });
    console.log('fn ordenar') + listaProductos;
    mostrarProductos();
}

/**********
 
 Ordena los productosd por precios

**********/

const botonOrdenarPorPrecio = document.getElementById('btnOrdenarPorPrecio');

botonOrdenarPorPrecio.addEventListener('click',ordenarProductosPorPrecio);

function ordenarProductosPorPrecio() {

    listaProductos.sort((a, b) => {
        // Comparo los productos por precio en orden descendente
        return a.precio - b.precio;
    });
    console.log('fn ordenar') + listaProductos;
    mostrarProductos();
}

/**********
 
 Obtener listadoProdcutos del local storage
 
**********/

function getProductosLocalStorage() {
    const productosJSON = localStorage.getItem("productos");

    // Si el usuario no tiene nada en localstorage
    if(productosJSON === null) {

        return listaProductos = [
            new Producto("Camiseta", 19.99, 10),
            new Producto("Zapatos", 49.99, 5),
            new Producto("Pantalones", 29.99, 8),
            new Producto("Sombrero", 15.99, 12),
            new Producto("Bufanda", 9.99, 20)
        ];
       

    } else {

        // Si el usuario tiene algo guardado en localStorage, lo parseo y devuelvo

        return JSON.parse(productosJSON);

    }
}

/**********
 
 Actualizar listadoProdcutos del local storage
 
**********/

function actualizarLocalStorage() {
    const productosJSON = JSON.stringify(listaProductos);

    localStorage.setItem("productos", productosJSON);
}




    