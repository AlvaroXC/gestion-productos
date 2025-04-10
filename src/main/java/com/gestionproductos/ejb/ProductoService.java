package com.gestionproductos.ejb;

import java.util.List;

import javax.ejb.Remote;

import com.gestionproductos.entity.Producto;

@Remote
public interface ProductoService {
    List<Producto> findAllProductos();
    Producto findProductoById(Long id);
    void saveProducto(Producto producto);
    void deleteProducto(Long id);
}