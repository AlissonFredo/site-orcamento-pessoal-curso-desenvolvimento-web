class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}

class Bd {
  constructor() {
    let id = localStorage.getItem("id");

    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  getProximoId() {
    let proximoId = localStorage.getItem("id");
    return parseInt(proximoId) + 1;
  }

  gravar(despesa) {
    let id = this.getProximoId();

    localStorage.setItem(id, JSON.stringify(despesa));

    localStorage.setItem("id", id);
  }

  recuperarTodosRegistros() {
    let despesas = Array();
    let id = localStorage.getItem("id");

    for (let i = 1; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));

      if (despesa === null) {
        continue;
      }

      despesa.id = i;
      despesas.push(despesa);
    }

    return despesas;
  }

  pesquisar(despesa) {
    let despesasFiltradas = Array();
    despesasFiltradas = this.recuperarTodosRegistros();

    if (despesa.ano != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (value) => value.ano == despesa.ano
      );
    }
    if (despesa.mes != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (value) => value.mes == despesa.mes
      );
    }
    if (despesa.dia != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (value) => value.dia == despesa.dia
      );
    }
    if (despesa.tipo != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (value) => value.tipo == despesa.tipo
      );
    }
    if (despesa.descricao != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (value) => value.descricao == despesa.descricao
      );
    }
    if (despesa.valor != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (value) => value.valor == despesa.valor
      );
    }

    return despesasFiltradas;
  }

  remover(id) {
    localStorage.removeItem(id);
  }
}

let bd = new Bd();

function cadastrarDispesa() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );

  if (despesa.validarDados()) {
    bd.gravar(despesa);

    document.getElementById("tituloModalRegistraDespesa").innerHTML =
      "Registro inserido com sucesso";
    document.getElementById("modalHeader").className =
      "modal-header text-success";
    document.getElementById("modalBody").innerHTML =
      "Despesa foi cadastrada com sucesso!";
    document.getElementById("buttonModalClose").innerHTML = "Voltar";
    document.getElementById("buttonModalClose").className = "btn btn-success";

    $("#modalRegistraDespesa").modal("show");

    ano.value = "";
    mes.value = "";
    dia.value = "";
    tipo.value = "";
    descricao.value = "";
    valor.value = "";
  } else {
    document.getElementById("tituloModalRegistraDespesa").innerHTML =
      "Erro na inclusão do registro";
    document.getElementById("modalHeader").className =
      "modal-header text-danger";
    document.getElementById("modalBody").innerHTML =
      "Erro na gravação, verifique se todos os campos foram preenchidos corretamente!";
    document.getElementById("buttonModalClose").innerHTML = "Voltar e corrigir";
    document.getElementById("buttonModalClose").className = "btn btn-danger";

    $("#modalRegistraDespesa").modal("show");
  }
}

function carregaListaDespesas(despesas = Array()) {
  if (despesas.length == 0) {
    despesas = bd.recuperarTodosRegistros();
  }

  let listaDespesas = document.getElementById("listaDespesas");
  listaDespesas.innerHTML = "";

  despesas.forEach(function (value) {
    let linha = listaDespesas.insertRow();

    linha.insertCell(0).innerHTML = `${value.dia}/${value.mes}/${value.ano}`;

    switch (parseInt(value.tipo)) {
      case 1:
        value.tipo = "Alimentação";
        break;
      case 2:
        value.tipo = "Educação";
        break;
      case 3:
        value.tipo = "Lazer";
        break;
      case 4:
        value.tipo = "Saúde";
        break;
      case 5:
        value.tipo = "Transporte";
        break;
    }

    linha.insertCell(1).innerHTML = value.tipo;
    linha.insertCell(2).innerHTML = value.descricao;
    linha.insertCell(3).innerHTML = value.valor;

    let btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.id = `id_despesa_${value.id}`;
    btn.onclick = function () {
      let id = this.id.replace("id_despesa_", "");

      bd.remover(id);

      window.location.reload();
    };

    linha.insertCell(4).append(btn);
  });
}

function pesquisarDespesa() {
  let ano = document.getElementById("ano").value;
  let mes = document.getElementById("mes").value;
  let dia = document.getElementById("dia").value;
  let tipo = document.getElementById("tipo").value;
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

  let despesas = bd.pesquisar(despesa);

  carregaListaDespesas(despesas);
}
