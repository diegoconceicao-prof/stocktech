// ================================
// STOCKTECH - CONTROLE DE ESTOQUE
// ================================


// Busca os produtos salvos

let produtos = JSON.parse(
    localStorage.getItem("produtos")
) || [];


// ================================
// SALVAR PRODUTOS
// ================================

function salvarProdutos() {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

}


// ================================
// CADASTRAR PRODUTO
// ================================

const formProduto = document.getElementById("formProduto");


if (formProduto) {

    formProduto.addEventListener("submit", function(event) {

        event.preventDefault();


        const nome = document.getElementById("nome").value;

        const categoria = document.getElementById("categoria").value;

        const quantidade = Number(
            document.getElementById("quantidade").value
        );

        const preco = Number(
            document.getElementById("preco").value
        );


        const produto = {

            id: Date.now(),

            nome: nome,

            categoria: categoria,

            quantidade: quantidade,

            preco: preco

        };


        produtos.push(produto);

        salvarProdutos();


        alert("Produto cadastrado com sucesso!");


        window.location.href = "produtos.html";

    });

}


// ================================
// LISTAR PRODUTOS
// ================================

function listarProdutos(lista = produtos) {

    const tabela =
        document.getElementById("listaProdutos");


    if (!tabela) return;


    tabela.innerHTML = "";


    if (lista.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td colspan="6"
                    class="text-center text-muted">

                    Nenhum produto cadastrado.

                </td>

            </tr>

        `;

        return;

    }


    lista.forEach(function(produto) {


        let status = "";


        if (produto.quantidade <= 5) {

            status =
                `<span class="badge bg-danger">
                    Estoque baixo
                </span>`;

        } else {

            status =
                `<span class="badge bg-success">
                    Normal
                </span>`;

        }


        tabela.innerHTML += `

            <tr>

                <td>

                    ${produto.nome}

                </td>


                <td>

                    ${produto.categoria}

                </td>


                <td>

                    ${produto.quantidade}

                </td>


                <td>

                    R$ ${produto.preco.toFixed(2)}

                </td>


                <td>

                    ${status}

                </td>


                <td>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="excluirProduto(${produto.id})">

                        Excluir

                    </button>

                </td>

            </tr>

        `;

    });

}


// ================================
// EXCLUIR PRODUTO
// ================================

function excluirProduto(id) {

    const confirmar =
        confirm("Deseja realmente excluir este produto?");


    if (!confirmar) {

        return;

    }


    produtos =
        produtos.filter(function(produto) {

            return produto.id !== id;

        });


    salvarProdutos();


    listarProdutos();


    atualizarDashboard();

}


// ================================
// PESQUISAR PRODUTO
// ================================

const campoBusca =
    document.getElementById("campoBusca");


if (campoBusca) {

    campoBusca.addEventListener("input", function() {


        const texto =
            campoBusca.value.toLowerCase();


        const produtosFiltrados =
            produtos.filter(function(produto) {


                return produto.nome
                    .toLowerCase()
                    .includes(texto);

            });


        listarProdutos(produtosFiltrados);

    });

}


// ================================
// DASHBOARD
// ================================

function atualizarDashboard() {


    const totalProdutos =
        document.getElementById("totalProdutos");


    if (!totalProdutos) return;


    const quantidadeEstoque =
        document.getElementById("quantidadeEstoque");


    const estoqueBaixo =
        document.getElementById("estoqueBaixo");


    const valorTotal =
        document.getElementById("valorTotal");


    // Total de produtos cadastrados

    totalProdutos.textContent =
        produtos.length;


    // Quantidade total

    const quantidadeTotal =
        produtos.reduce(function(total, produto) {

            return total + produto.quantidade;

        }, 0);


    quantidadeEstoque.textContent =
        quantidadeTotal;


    // Produtos com estoque baixo

    const produtosBaixo =
        produtos.filter(function(produto) {

            return produto.quantidade <= 5;

        });


    estoqueBaixo.textContent =
        produtosBaixo.length;


    // Valor total

    const valor =
        produtos.reduce(function(total, produto) {

            return total +
                produto.quantidade *
                produto.preco;

        }, 0);


    valorTotal.textContent =
        valor.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );


    // Lista de estoque baixo

    const lista =
        document.getElementById("listaEstoqueBaixo");


    if (lista) {


        if (produtosBaixo.length === 0) {

            lista.innerHTML = `

                <p class="text-success">

                    ✅ Nenhum produto com estoque baixo.

                </p>

            `;

        } else {


            lista.innerHTML = "";


            produtosBaixo.forEach(function(produto) {


                lista.innerHTML += `

                    <div class="alert alert-warning">

                        ⚠️ <strong>
                            ${produto.nome}
                        </strong>

                        possui apenas

                        <strong>
                            ${produto.quantidade}
                        </strong>

                        unidades em estoque.

                    </div>

                `;

            });

        }

    }

}


// ================================
// INICIAR SISTEMA
// ================================

listarProdutos();

atualizarDashboard();