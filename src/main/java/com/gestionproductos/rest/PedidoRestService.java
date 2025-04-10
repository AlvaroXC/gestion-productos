package com.gestionproductos.rest;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;
import com.gestionproductos.ejb.PedidoService;
import com.gestionproductos.entity.Pedido;
import java.util.List;
import jakarta.ws.rs.core.MediaType;

@Path("/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequestScoped
public class PedidoRestService {
    @Inject
    private PedidoService pedidoService;

    @GET
    public Response getAllPedidos() {
        List<Pedido> pedidos = pedidoService.findAllPedidos();
        return Response.ok(pedidos).build();
    }

    @GET
    @Path("/{id}")
    public Response getPedidoById(@PathParam("id") Long id) {
        Pedido pedido = pedidoService.findPedidoById(id);
        if (pedido != null) {
            return Response.ok(pedido).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @POST
    public Response createPedido(Pedido pedido) {
        try {
            pedidoService.crearPedido(pedido);
            return Response.status(Response.Status.CREATED).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}/estado")
    public Response updateEstadoPedido(@PathParam("id") Long id, String nuevoEstado) {
        pedidoService.actualizarEstadoPedido(id, nuevoEstado);
        return Response.ok().build();
    }
}