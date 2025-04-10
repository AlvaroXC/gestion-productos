// Variables globales
const API_URL = 'http://127.0.0.1:8080/gestionproductos-1.0-SNAPSHOT/api';
let productos = [];
let pedidos = [];
let productosSeleccionados = [];
const modal = document.getElementById('modal-confirm');

// Funciones de navegación y utilidades
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

function toggleLoader(show) {
    document.getElementById('loader').style.display = show ? 'block' : 'none';
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification ' + type;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function handleApiError(error) {
    console.error('Error API:', error);
    toggleLoader(false);
    showNotification(`Error: ${error.message}`, 'error');
}

// Funciones de gestión de productos
async function loadProductos() {
    try {
        toggleLoader(true);
        
        const response = await fetch(`${API_URL}/productos`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        productos = await response.json();
        renderProductos();
        toggleLoader(false);
    } catch (error) {
        handleApiError(error);
    }
}

function renderProductos() {
    const tbody = document.querySelector('#productos-table tbody');
    tbody.innerHTML = '';
    
    if (productos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="6" style="text-align:center;">No hay productos disponibles</td>';
        tbody.appendChild(tr);
        return;
    }
    
    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion || '-'}</td>
            <td> $${parseFloat(producto.precio).toFixed(2)}</td>
            <td>${producto.stock}</td>
            <td>
                <button class="btn btn-warning btn-edit" data-id="${producto.id}">Editar</button>
                <button class="btn btn-danger btn-delete" data-id="${producto.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Asignar eventos a botones
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            editProducto(id);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            showConfirmDeleteProducto(id);
        });
    });
}

function addProducto() {
    document.getElementById('producto-form').reset();
    document.getElementById('producto-id').value = '';
    document.getElementById('producto-form-title').textContent = 'Añadir Producto';
    showSection('producto-form-section');
}

function editProducto(id) {
    const producto = productos.find(p => p.id == id);
    
    if (!producto) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    document.getElementById('producto-id').value = producto.id;
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('descripcion').value = producto.descripcion || '';
    document.getElementById('precio').value = parseFloat(producto.precio);
    document.getElementById('stock').value = producto.stock;
    
    document.getElementById('producto-form-title').textContent = 'Editar Producto';
    showSection('producto-form-section');
}

function showConfirmDeleteProducto(id) {
    const producto = productos.find(p => p.id == id);
    
    if (!producto) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    document.getElementById('modal-message').textContent = `¿Estás seguro de que quieres eliminar el producto "${producto.nombre}"?`;
    
    const confirmBtn = document.getElementById('btn-modal-confirm');
    // Eliminar eventos previos
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener('click', () => {
        deleteProducto(id);
        modal.style.display = 'none';
    });
    
    modal.style.display = 'flex';
}

async function deleteProducto(id) {
    try {
        toggleLoader(true);
        
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        showNotification('Producto eliminado correctamente', 'success');
        await loadProductos();
    } catch (error) {
        handleApiError(error);
    }
}

async function saveProducto(event) {
    event.preventDefault();
    
    const id = document.getElementById('producto-id').value;
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);
    
    const producto = {
        nombre,
        descripcion,
        precio,
        stock
    };
    
    if (id) {
        producto.id = parseInt(id);
    }
    
    try {
        toggleLoader(true);
        
        const url = id ? `${API_URL}/productos/${id}` : `${API_URL}/productos`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        showNotification(`Producto ${id ? 'actualizado' : 'creado'} correctamente`, 'success');
        await loadProductos();
        showSection('productos-list');
    } catch (error) {
        handleApiError(error);
    }
}

// Funciones de gestión de pedidos
async function loadPedidos() {
    try {
        toggleLoader(true);
        
        const response = await fetch(`${API_URL}/pedidos`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        pedidos = await response.json();
        renderPedidos();
        toggleLoader(false);
    } catch (error) {
        handleApiError(error);
    }
}

function renderPedidos() {
    const tbody = document.querySelector('#pedidos-table tbody');
    tbody.innerHTML = '';
    
    if (pedidos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="6" style="text-align:center;">No hay pedidos disponibles</td>';
        tbody.appendChild(tr);
        return;
    }
    
    pedidos.forEach(pedido => {
        const fecha = new Date(pedido.fechaCreacion).toLocaleDateString();
        const total = calcularTotalPedido(pedido);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.clienteId || 'No disponible'}</td>
            <td>${fecha}</td>
            <td><span class="estado-pedido estado-${pedido.estado.toLowerCase()}">${pedido.estado}</span></td>
            <td>$${total.toFixed(2)}</td>
            <td>
                <button class="btn btn-view-pedido" data-id="${pedido.id}">Ver</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Asignar eventos
    document.querySelectorAll('.btn-view-pedido').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            viewPedido(id);
        });
    });
}

function calcularTotalPedido(pedido) {
    if (!pedido.detalles || pedido.detalles.length === 0) return 0;
    
    return pedido.detalles.reduce((total, detalle) => {
        return total + (detalle.cantidad * parseFloat(detalle.precioUnitario));
    }, 0);
}

function viewPedido(id) {
    const pedido = pedidos.find(p => p.id == id);
    if (!pedido) {
        showNotification('Pedido no encontrado', 'error');
        return;
    }

    const infoContainer = document.getElementById('pedido-info');
    const detalleTbody = document.getElementById('pedido-detalle-tbody');
    console.log(detalleTbody);
    const fecha = new Date(pedido.fechaCreacion).toLocaleDateString();
    const total = calcularTotalPedido(pedido);

    // Limpiar el tbody antes de añadir nuevas filas
    detalleTbody.innerHTML = '';

    infoContainer.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">ID:</div>
            <div>${pedido.id}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Cliente ID:</div>
            <div>${pedido.clienteId || 'No disponible'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Fecha:</div>
            <div>${fecha}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Estado:</div>
            <div><span class="estado-pedido estado-${pedido.estado.toLowerCase()}">${pedido.estado}</span></div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Total:</div>
            <div>$${total.toFixed(2)}</div>
        </div>
    `;

    // Verificar si hay detalles en el pedido
    if (!pedido.detalles || pedido.detalles.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="4" style="text-align:center;">No hay productos en este pedido</td>';
        detalleTbody.appendChild(tr);
    } else {
        pedido.detalles.forEach(detalle => {
            const subtotal = detalle.cantidad * parseFloat(detalle.precioUnitario);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${detalle.producto ? detalle.producto.nombre : 'Producto no disponible'}</td>
                <td>${detalle.cantidad}</td>
                <td>$${parseFloat(detalle.precioUnitario).toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)} </td>
            `;
            detalleTbody.appendChild(tr);
        });
    }
    
    // Configurar selector de estado
    const estadoSelect = document.getElementById('estado-pedido');
    estadoSelect.value = pedido.estado;
    
    // Configurar botón actualizar estado
    const btnActualizarEstado = document.getElementById('btn-actualizar-estado');
    btnActualizarEstado.onclick = () => actualizarEstadoPedido(pedido.id, estadoSelect.value);
    
    showSection('pedido-detalle');
}

// Actualizar estado de un pedido
async function actualizarEstadoPedido(id, nuevoEstado) {
    try {
        toggleLoader(true);
        
        const pedido = pedidos.find(p => p.id == id);
        if (!pedido) {
            throw new Error('Pedido no encontrado');
        }
        const response = await fetch(`${API_URL}/pedidos/${id}/estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: nuevoEstado
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        showNotification('Estado del pedido actualizado correctamente', 'success');
        await loadPedidos();
        showSection('pedidos-list');
    } catch (error) {
        handleApiError(error);
    }
}

// Preparar formulario para crear pedido
async function addPedido() {
    // Resetear el formulario y la lista de productos seleccionados
    document.getElementById('pedido-form').reset();
    productosSeleccionados = [];
    actualizarProductosSeleccionados();
    
    // Cargar productos disponibles si fuera necesario
    if (productos.length === 0) {
        await loadProductos();
    }
    
    // Renderizar tabla de productos disponibles
    renderProductosParaPedido();
    
    showSection('pedido-form-section');
}

// Renderizar tabla de productos disponibles para el pedido
function renderProductosParaPedido() {
    const tbody = document.querySelector('#productos-pedido-table tbody');
    tbody.innerHTML = '';
    
    if (productos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="5" style="text-align:center;">No hay productos disponibles</td>';
        tbody.appendChild(tr);
        return;
    }
    
    productos.forEach(producto => {
        if (producto.stock > 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.stock}</td>
                <td>$${parseFloat(producto.precio).toFixed(2)} </td>
                <td>
                    <input type="number" min="1" max="${producto.stock}" value="1" class="cantidad-input" data-id="${producto.id}">
                </td>
                <td>
                    <button class="btn btn-success btn-add-to-pedido" data-id="${producto.id}">Añadir</button>
                </td>
            `;
            tbody.appendChild(tr);
        }
    });
    
    // Asignar eventos
    document.querySelectorAll('.btn-add-to-pedido').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const cantidad = parseInt(document.querySelector(`.cantidad-input[data-id="${id}"]`).value);
            addProductoToPedido(id, cantidad);
        });
    });
}

// Añadir producto al pedido
function addProductoToPedido(id, cantidad) {
    const producto = productos.find(p => p.id == id);
    
    if (!producto) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    if (cantidad <= 0 || cantidad > producto.stock) {
        showNotification('Cantidad no válida', 'error');
        return;
    }
    
    // Comprobar si el producto ya estaba seleccionado
    const existente = productosSeleccionados.findIndex(p => p.productoId == id);
    
    if (existente !== -1) {
        // Actualizar cantidad si ya existe
        productosSeleccionados[existente].cantidad += cantidad;
    } else {
        // Añadir nuevo producto seleccionado
        productosSeleccionados.push({
            productoId: parseInt(producto.id),
            producto: producto,
            cantidad: cantidad,
            precioUnitario: parseFloat(producto.precio)
        });
    }
    
    actualizarProductosSeleccionados();
    showNotification(`${cantidad} unidades de ${producto.nombre} añadidas al pedido`, 'success');
}

// Actualizar tabla de productos seleccionados
function actualizarProductosSeleccionados() {
    const tbody = document.querySelector('#seleccionados-table tbody');
    tbody.innerHTML = '';
    
    if (productosSeleccionados.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="5" style="text-align:center;">No hay productos seleccionados</td>';
        tbody.appendChild(tr);
        
        document.getElementById('total-pedido').textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    productosSeleccionados.forEach((item, index) => {
        const subtotal = item.cantidad * item.precioUnitario;
        total += subtotal;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.producto.nombre}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precioUnitario.toFixed(2)}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-remove-from-pedido" data-index="${index}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    document.getElementById('total-pedido').textContent = `$${total.toFixed(2)}`;
    
    // Asignar eventos
    document.querySelectorAll('.btn-remove-from-pedido').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            productosSeleccionados.splice(index, 1);
            actualizarProductosSeleccionados();
        });
    });
}

// Crear pedido
async function crearPedido(event) {
    event.preventDefault();
    
    if (productosSeleccionados.length === 0) {
        showNotification('Debes añadir al menos un producto al pedido', 'error');
        return;
    }
    
    const clienteId = parseInt(document.getElementById('cliente').value) || 1; // Id de cliente por defecto si no hay campo
    
    // Crear objeto pedido según el modelo de Java
    const pedido = {
        clienteId: clienteId,
        estado: 'PENDIENTE',
        fechaCreacion: new Date().toISOString(),
        detalles: productosSeleccionados.map(item => {
            return {
                producto: {
                    id: item.productoId
                },
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario
            };
        })
    };
    
    try {
        toggleLoader(true);
        
        const response = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        
        showNotification('Pedido creado correctamente', 'success');
        await loadPedidos();
        showSection('pedidos-list');
    } catch (error) {
        handleApiError(error);
    }
}

// Configurar eventos del modal
document.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
});

document.getElementById('btn-modal-cancel').addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Configurar eventos para botones principales
document.getElementById('btn-add-producto').addEventListener('click', addProducto);
document.getElementById('btn-cancelar-producto').addEventListener('click', () => showSection('productos-list'));
document.getElementById('btn-volver-productos').addEventListener('click', () => showSection('productos-list'));

document.getElementById('btn-add-pedido').addEventListener('click', addPedido);
document.getElementById('btn-cancelar-pedido').addEventListener('click', () => showSection('pedidos-list'));
document.getElementById('btn-volver-pedidos').addEventListener('click', () => showSection('pedidos-list'));

// Configurar navegación
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const section = link.getAttribute('data-section');
        showSection(section);
    });
});

// Configurar formularios
document.getElementById('producto-form').addEventListener('submit', saveProducto);
document.getElementById('pedido-form').addEventListener('submit', crearPedido);

// Inicializar la aplicación
async function init() {
    try {
        await Promise.all([loadProductos(), loadPedidos()]);
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        showNotification('Error al cargar los datos iniciales', 'error');
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);