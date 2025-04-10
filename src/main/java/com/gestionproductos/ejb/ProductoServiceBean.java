package com.gestionproductos.ejb;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.gestionproductos.entity.Producto;

@Stateless
public class ProductoServiceBean implements ProductoService {
    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Producto> findAllProductos() {
        return em.createQuery("SELECT p FROM Producto p", Producto.class).getResultList();
    }

    @Override
    public Producto findProductoById(Long id) {
        return em.find(Producto.class, id);
    }

    @Override
    public void saveProducto(Producto producto) {
        if (producto.getId() == null) {
            em.persist(producto);
        } else {
            em.merge(producto);
        }
    }

    @Override
    public void deleteProducto(Long id) {
        Producto producto = findProductoById(id);
        if (producto != null) {
            em.remove(producto);
        }
    }
}