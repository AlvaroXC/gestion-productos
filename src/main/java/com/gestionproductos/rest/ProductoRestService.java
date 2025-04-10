package com.gestionproductos.rest;

import java.util.List;

import javax.ejb.EJB;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MediaType;
import com.gestionproductos.ejb.ProductoService;
import com.gestionproductos.entity.Producto;

@Path("/productos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductoRestService {
    @EJB
    private ProductoService productoService;

    @GET
    public Response getAllProductos() {
        List<Producto> productos = productoService.findAllProductos();
        return Response.ok(productos).build();
    }

    @GET
    @Path("/{id}")
    public Response getProductoById(@PathParam("id") Long id) {
        Producto producto = productoService.findProductoById(id);
        if (producto != null) {
            return Response.ok(producto).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @POST
    public Response createProducto(Producto producto) {
        productoService.saveProducto(producto);
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateProducto(@PathParam("id") Long id, Producto producto) {
        producto.setId(id);
        productoService.saveProducto(producto);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteProducto(@PathParam("id") Long id) {
        productoService.deleteProducto(id);
        return Response.ok().build();
    }
}