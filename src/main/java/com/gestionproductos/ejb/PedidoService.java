package com.gestionproductos.ejb;

import java.util.List;

import javax.ejb.Remote;

import com.gestionproductos.entity.Pedido;

@Remote
public interface PedidoService {
    List<Pedido> findAllPedidos();
    Pedido findPedidoById(Long id);
    void crearPedido(Pedido pedido) throws BussinessException;
    void actualizarEstadoPedido(Long id, String nuevoEstado);
}
