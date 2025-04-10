package com.gestionproductos.soap;

import javax.ejb.EJB;
import javax.jws.WebMethod;
import javax.jws.WebService;

import com.gestionproductos.ejb.PedidoService;
import com.gestionproductos.entity.Pedido;

@WebService
public class PedidoConsultaWebService {
    @EJB
    private PedidoService pedidoService;

    @WebMethod
    public Pedido getPedidoById(Long id) {
        return pedidoService.findPedidoById(id);
    }

    @WebMethod
    public String getEstadoPedido(Long id) {
        Pedido pedido = pedidoService.findPedidoById(id);
        return pedido != null ? pedido.getEstado() : "PEDIDO_NO_ENCONTRADO";
    }
}