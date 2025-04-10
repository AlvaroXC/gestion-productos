package com.gestionproductos.rest;

import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import com.gestionproductos.ejb.PedidoService;
import com.gestionproductos.entity.Pedido;
import java.util.List;
import javax.ws.rs.core.MediaType;



@Path("/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PedidoRestService {
    @EJB
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