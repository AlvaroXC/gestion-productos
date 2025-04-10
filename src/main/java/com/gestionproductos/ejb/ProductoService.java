package com.gestionproductos.ejb;

import java.util.List;

import jakarta.ejb.Local;

import com.gestionproductos.entity.Producto;

@Local
public interface ProductoService {
    List<Producto> findAllProductos();
    Producto findProductoById(Long id);
    void saveProducto(Producto producto);
    void deleteProducto(Long id);
}