document.addEventListener('DOMContentLoaded', () => {
    const cart = []; // Arreglo para los productos del carrito de compras
    const cartItemsElement = document.getElementById('cart-items'); // Elemento de la lista
    const cartTotalElement = document.getElementById('cart-total'); // Total del carrito
    const paymentElement = document.getElementById('payment'); // Simulación de pago
    const receiptElement = document.getElementById('receipt'); // Muestra del recibo-factura
    const receiptItemsElement = document.getElementById('receipt-items'); // Recibo dentro de la paginca
    const receiptTotalElement = document.getElementById('receipt-total'); // Total dentro de la pagina
    const checkoutButton = document.getElementById('checkout'); // Finalización de compra
    const backButton = document.getElementById('back'); // Boton para regresar

    // Evento para agregar items al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.product'); // Obtiene el producto
            const productName = productElement.getAttribute('data-name'); // Obtiene el nombre
            const productPrice = parseFloat(productElement.getAttribute('data-price')); // Obtiene el precio del producto

            // Busca si el producto ya está en el carrito para sumarlo
            const existingProduct = cart.find(item => item.name === productName);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({ name: productName, price: productPrice, quantity: 1 }); // Agrega un nuevo producto al carrito
            }
            updateCart(); // Actualiza la visualización del carrito
        });
    });

    // Actualizar la visualización del carrito
    function updateCart() {
        cartItemsElement.innerHTML = ''; // Limpia los elementos del carrito
        let total = 0; // Inicializa el total del carrito
        cart.forEach(item => {
            const listItem = document.createElement('li'); // Creación de lista por cada producto
            listItem.textContent = `${item.name} - Q.${item.price} x ${item.quantity}`;
            const removeButton = document.createElement('img'); // Crea una imagen de eliminar
            removeButton.src = 'images/eliminar.png';
            removeButton.classList.add('remove-button'); // Añade la clase CSS para el tamaño de la imagen
            // Evento para eliminar el elemento del carrito
            removeButton.addEventListener('click', () => {
                cart.splice(cart.indexOf(item), 1); // Elimina el producto del carrito
                updateCart();
            });
            listItem.appendChild(removeButton); // Añade la imagen de eliminar al elemento de lista
            cartItemsElement.appendChild(listItem); // Muestra la lista
            total += item.price * item.quantity; // Suma el precio total del carrito
        });
        cartTotalElement.textContent = total.toFixed(2); // Actualiza el total en el DOM
    }

    // Generar el PDF del recibo
    function generatePDF() {
        const { jsPDF } = window.jspdf; //obtener la clase PDF
        const doc = new jsPDF();

        // Título
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Proyecto Punto de Venta", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

        // Fecha
        const date = new Date();
        const dateString = date.toLocaleString();
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(dateString, doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });

        // Tabla de productos
        const startY = 40;
        let currentY = startY;
        const tableColumn = ["Producto", "Cantidad", "Precio", "Total"];
        const tableRows = [];

        cart.forEach(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            const rowData = [item.name, item.quantity.toString(), `Q.${item.price.toFixed(2)}`, `Q.${itemTotal}`];
            tableRows.push(rowData);
        }); //Agregar una fila por cada producto

        // Muestra la tabla
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: currentY,
            theme: 'grid',
            headStyles: { fillColor: [243, 156, 18] }, // Color de fondo de los encabezados
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 40, halign: 'right' },
                2: { cellWidth: 40, halign: 'right' },
                3: { cellWidth: 40, halign: 'right' }
            },
            styles: {
                overflow: 'linebreak',
                cellPadding: 3,
                fontSize: 10
            },
            didDrawPage: (data) => {
                currentY = data.cursor.y;
            }
        });

        // Total general
        const total = parseFloat(cartTotalElement.textContent);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Total General: Q.${total.toFixed(2)}`, doc.internal.pageSize.getWidth() / 2, currentY + 10, { align: "center" });

        // Descargar el PDF
        doc.save('recibo.pdf');
    }

    // Finalizar compra
    checkoutButton.addEventListener('click', () => {
        document.querySelector('.products').classList.add('hidden'); // Oculta los productos
        document.querySelector('.cart').classList.add('hidden'); // Oculta el carrito
        paymentElement.classList.remove('hidden'); // Muestra la simulación de pago

        // Simula un proceso de pago de 2 segundos
        setTimeout(() => {
            paymentElement.classList.add('hidden'); // Oculta la simulación de pago
            receiptElement.classList.remove('hidden'); // Muestra el recibo
            generatePDF(); // Genera el PDF del recibo
        }, 2000);
    });

    // Evento de clic para el botón de volver
    backButton.addEventListener('click', () => {
        document.querySelector('.products').classList.remove('hidden'); // Muestra los productos
        document.querySelector('.cart').classList.remove('hidden'); // Muestra el carrito
        receiptElement.classList.add('hidden'); // Oculta el recibo
        cart.length = 0;
        updateCart();
    });
});

