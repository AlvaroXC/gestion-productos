package com.gestionproductos.ejb;

import java.util.Date;
import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
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
        return em.createQuery("SELECT p FROM Pedido p", Pedido.class).getResultList();
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
            Producto producto = productoService.findProductoById(detalle.getProducto().getId());
            if (producto.getStock() < detalle.getCantidad()) {
                throw new BussinessException("Stock insuficiente para " + producto.getNombre());
            }
            producto.setStock(producto.getStock() - detalle.getCantidad());
            productoService.saveProducto(producto);

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