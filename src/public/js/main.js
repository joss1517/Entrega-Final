const socket = io();

socket.on('products', (data) => {
  console.log(data);
  
})

const renderProductos = (products) => {
  const contenedorProductos = document.getElementById('contenedorProductos')

  products.forEach(item => {
    const card = document.createElement('div')

    card.innerHTML =
      `
        <p> ${item.id} </p>
        <p> ${item.title} </p>
        <p> ${item.size} </p>
        <p> ${item.price} </p>
        <button> Eliminar </button>

      `
    contenedorProductos.appendChild(card);
  })
}

