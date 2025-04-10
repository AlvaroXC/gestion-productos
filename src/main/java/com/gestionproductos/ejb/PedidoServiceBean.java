package com.gestionproductos.ejb;

import java.util.Date;
import java.util.List;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import com.gestionproductos.entity.DetallePedido;
import com.gestionproductos.entity.Pedido;
import com.gestionproductos.entity.Producto;

@Stateless
public class PedidoServiceBean implements PedidoService {
    @PersistenceContext
    private EntityManager em;

    @EJB
    private ProductoService productoService;

    @Override
    public List<Pedido> findAllPedidos() {
        return em.createQuery("SELECT p FROM Pedido p LEFT JOIN FETCH p.detalles", Pedido.class)
                .getResultList();
    }

    @Override
    public Pedido findPedidoById(Long id) {
        return em.find(Pedido.class, id);
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void crearPedido(Pedido pedido) throws BussinessException {
        pedido.setFechaCreacion(new Date());
        pedido.setEstado("PENDIENTE");

        // Verificar stock y actualizar inventario
        for (DetallePedido detalle : pedido.getDetalles()) {
            Long productoId = detalle.getProducto() != null ? detalle.getProducto().getId() : null;
            if (productoId == null) {
                throw new BussinessException("Falta el ID del producto en uno de los detalles");
            }

            Producto producto = productoService.findProductoById(productoId);
            if (producto == null) {
                throw new BussinessException("No existe un producto con ID " + productoId);
            }

            if (producto.getStock() < detalle.getCantidad()) {
                throw new BussinessException("Stock insuficiente para " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - detalle.getCantidad());
            em.merge(producto); // usamos directamente em para consistencia

            detalle.setProducto(producto); // asociar al producto gestionado
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setPedido(pedido);

        }

        em.persist(pedido);
    }

    @Override
    public void actualizarEstadoPedido(Long id, String nuevoEstado) {
        Pedido pedido = findPedidoById(id);
        if (pedido != null) {
            pedido.setEstado(nuevoEstado);
            em.merge(pedido);
        }
    }
}