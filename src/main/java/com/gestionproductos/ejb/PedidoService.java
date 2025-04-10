package com.gestionproductos.ejb;

import java.util.List;

import jakarta.ejb.Local;

import com.gestionproductos.entity.Pedido;

@Local
public interface PedidoService {
    List<Pedido> findAllPedidos();
    Pedido findPedidoById(Long id);
    void crearPedido(Pedido pedido) throws BussinessException;
    void actualizarEstadoPedido(Long id, String nuevoEstado);
}
