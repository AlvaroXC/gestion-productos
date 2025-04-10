package com.gestionproductos.soap;

import java.util.List;

import javax.ejb.EJB;
import javax.jws.WebMethod;
import javax.jws.WebService;

import com.gestionproductos.ejb.ProductoService;
import com.gestionproductos.entity.Producto;

@WebService
public class ProductoWebService {
    @EJB
    private ProductoService productoService;

    @WebMethod
    public List<Producto> getAllProductos() {
        return productoService.findAllProductos();
    }

    @WebMethod
    public Producto getProductoById(Long id) {
        return productoService.findProductoById(id);
    }
}