const DoacaoModel = {
    objeto: '',
    qntd: 0,
    historico: {
        entradas: {
            qntdModify: 0,
            data: '',
            doador: '',
            receptor: ''
        },
        saidas: {
            qntdModify: 0,
            data: '',
            entregador: '',
            destinatario: ''
        }
    }
};

module.exports = { DoacaoModel };