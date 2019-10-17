import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'box-open',
    title: 'Compras',
    subtitle: 'Cadastro da compra: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3001/shopping'
const baseUrlUsers = 'http://localhost:3001/users'
const baseUrlProducts = 'http://localhost:3001/products'


const initialState = {
    shopping: { id_user: '', id_product: '', quantity: '', price: '', id: '' },
    list: [],
    listProducts: [],
    listUsers: []
}

export default class ShoppingCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
        axios(baseUrlProducts).then(resp => {
            this.setState({ listProducts: resp.data })
        })
        axios(baseUrlUsers).then(resp => {
            this.setState({ listUsers: resp.data })
        })
    }

    clear() {
        this.setState({ shopping: initialState.shopping })
    }

    save() {
        const shopping = this.state.shopping
        const method = shopping.id ? 'put' : 'post'
        const url = shopping.id ? `${baseUrl}/${shopping.id}` : baseUrl
        axios[method](url, shopping)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ shopping: initialState.shopping, list })
            })
    }

    getUpdatedList(shopping, add = true) {
        const list = this.state.list.filter(s => s.id !== shopping.id)
        if (add) list.unshift(shopping)//insere na primeira posicao da lista
        return list
    }

    updateField(event) {
        const shopping = { ...this.state.shopping }
        shopping[event.target.name] = event.target.value
        this.setState({ shopping })
    }
    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Usuário</label>
                            <select
                                className="form-control"
                                name="id_user"
                                value={this.state.shopping.id_user}
                                onChange={e => this.updateField(e)}>
                                {
                                    this.state.listUsers.map(users => {
                                        return <option value={users.id}> {users.name} </option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Produtos</label>
                            <select className="form-control"
                                name="id_product"
                                value={this.state.shopping.id_product}
                                onChange={e => this.updateField(e)}>
                                {
                                    this.state.listProducts.map(products => {
                                        return <option value={products.id}> {products.description} </option>
                                    })
                                }
                            </select>

                        </div>
                    </div>


                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Quantidade</label>
                            <input type="number" className="form-control"
                                name="quantity"
                                value={this.state.shopping.quantity}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a quantidade..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Preço</label>
                            <input type="text" className="form-control"
                                name="price"
                                value={this.state.shopping.price}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o preço..." />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(shopping) {
        this.setState({ shopping })
    }

    remove(shopping) {
        axios.delete(`${baseUrl}/${shopping.id}`).then(resp => {
            const list = this.getUpdatedList(shopping, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Id Usuario</th>
                        <th>Id Produto</th>
                        <th>Quantidade</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(shopping => {
            return (
                <tr key={shopping.id}>
                    <td>{shopping.id}</td>
                    <td>{shopping.id_user}</td>
                    <td>{shopping.id_product}</td>
                    <td>{shopping.quantity}</td>
                    <td>{shopping.price}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(shopping)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(shopping)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}