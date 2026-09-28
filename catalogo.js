// Funciones compartidas por index.html y liga.html

const INSTAGRAM_USUARIO = 'streetwear.store01';

function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function cargarEquipos() {
  const respuesta = await fetch('equipos.json');
  if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
  return respuesta.json();
}

function sinFoto(img, texto) {
  const aviso = document.createElement('div');
  aviso.className = 'sin-foto';
  aviso.textContent = texto || 'Foto próximamente';
  img.replaceWith(aviso);
}

let temporizadorAviso;

function mostrarAviso(texto) {
  let aviso = document.getElementById('aviso');
  if (!aviso) {
    aviso = document.createElement('div');
    aviso.id = 'aviso';
    aviso.setAttribute('role', 'status');
    document.body.appendChild(aviso);
  }
  aviso.textContent = texto;
  aviso.classList.add('visible');
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(function () {
    aviso.classList.remove('visible');
  }, 4000);
}

function consultarPorInstagram(nombre) {
  const mensaje = 'Hola, me interesa la camiseta ' + nombre + '. ¿Está disponible?';
  let copiado = Promise.resolve(false);

  if (navigator.clipboard) {
    copiado = navigator.clipboard.writeText(mensaje).then(function () { return true; }).catch(function () { return false; });
  }

  window.open('https://ig.me/m/' + INSTAGRAM_USUARIO, '_blank', 'noopener');

  copiado.then(function (ok) {
    mostrarAviso(ok
      ? 'Mensaje copiado. Pégalo en el chat de Instagram.'
      : 'Indica en el chat qué camiseta te interesa: ' + nombre);
  });
}

function anadirBoton(article, nombre) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'btn-consulta';
  boton.textContent = 'Consultar por Instagram';
  boton.addEventListener('click', function () { consultarPorInstagram(nombre); });
  article.appendChild(boton);
}

// Tarjeta de una equipación (camiseta) con botón de consulta.
// camiseta: { nombre, imagen, precio? }  |  etiqueta: texto bajo el nombre (opcional)
// textoConsulta: nombre completo para el mensaje de Instagram y el texto alternativo
function crearTarjeta(camiseta, etiqueta, textoConsulta) {
  const completo = textoConsulta || camiseta.nombre;

  const article = document.createElement('article');
  article.className = 'camiseta';

  const contenedor = document.createElement('div');
  contenedor.className = 'camiseta-img';

  const img = document.createElement('img');
  img.addEventListener('error', function () { sinFoto(img); }, { once: true });
  img.src = camiseta.imagen;
  img.alt = 'Camiseta ' + completo;
  img.loading = 'lazy';
  contenedor.appendChild(img);

  const info = document.createElement('div');
  info.className = 'camiseta-info';

  const nombre = document.createElement('p');
  nombre.textContent = camiseta.nombre;
  info.appendChild(nombre);

  if (etiqueta) {
    const dato = document.createElement('span');
    dato.className = 'camiseta-dato';
    dato.textContent = etiqueta;
    info.appendChild(dato);
  }

  if (camiseta.precio) {
    const precio = document.createElement('span');
    precio.className = 'camiseta-precio';
    precio.textContent = camiseta.precio;
    info.appendChild(precio);
  }

  article.append(contenedor, info);
  anadirBoton(article, completo);
  return article;
}

// Tarjeta de un equipo (escudo) que enlaza a su página de equipaciones
function crearTarjetaEquipo(idLiga, equipo, nombreLiga) {
  const enlace = document.createElement('a');
  enlace.className = 'camiseta enlace-equipo';
  enlace.href = 'equipo.html?liga=' + encodeURIComponent(idLiga) + '&equipo=' + encodeURIComponent(equipo.id);

  const contenedor = document.createElement('div');
  contenedor.className = 'camiseta-img';

  const img = document.createElement('img');
  img.addEventListener('error', function () { sinFoto(img, 'Escudo próximamente'); }, { once: true });
  img.src = equipo.escudo;
  img.alt = 'Escudo ' + equipo.nombre;
  img.loading = 'lazy';
  contenedor.appendChild(img);

  const info = document.createElement('div');
  info.className = 'camiseta-info';

  const nombre = document.createElement('p');
  nombre.textContent = equipo.nombre;
  info.appendChild(nombre);

  if (nombreLiga) {
    const dato = document.createElement('span');
    dato.className = 'camiseta-dato';
    dato.textContent = nombreLiga;
    info.appendChild(dato);
  }

  enlace.append(contenedor, info);
  return enlace;
}
