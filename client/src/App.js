import React, { Component } from 'react';
import './App.css';

import BurgerTable from './BurgerTable';
import IngredientTable from './IngredientTable';

import ViewBurgerModal from './ViewBurgerModal';
import EditBurgerModal from './EditBurgerModal';
import CreateBurgerModal from './CreateBurgerModal';
import EditIngredientModal from './EditIngredientsModal';
import CreateIngredientModal from './CreateIngredientModal';

import API from './router/API';

class App extends Component {
  constructor() {
    super()

    this.searchMYSQL = this.searchMYSQL.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.editItem = this.editItem.bind(this)
    this.createItem = this.createItem.bind(this)
    this.viewModals = this.viewModals.bind(this)
  }

  state = {
    table: 'burger',
    burgers: [],
    ingredients: [],
    objectValues: {},
    ViewNutrition: false,
    EditBurger: false,
    CreateBurger: false,
    EditIngredient: false,
    CreateIngredient: false
  }

  componentDidMount() {
    this.searchMYSQL()

  };

  async searchMYSQL() {
    let burger = await API.table("burger")
    let ingredient = await API.table("ingredients")
    this.setState({ burgers: burger.data, ingredients: ingredient.data })
  }

  async restoreSQL() {
    let newData = await API.restoreSQL()
    console.log(newData)
  }

  async deleteItem(table, id) {
    let newData = await API.delete(table, id)
    if (table === "burger") {
      this.setState({ burgers: newData.data })
    } else {
      this.setState({ ingredients: newData.data })
    }
  }

  async editItem(values) {
    await API.update(values)
    // this.searchMYSQL()
  }

  async createItem(table, values) {
    var newData = await API.create(table, values)
    if (table === "burger") {
      console.log("updating burger")
      this.setState({ burgers: newData.data })
    } else {
      this.setState({ ingredients: newData.data })
    }
  }

  async nutritionValue(id) {
    console.log(id)
    let data = await API.nutrition(id)
    console.log(data)
  }

  viewModals(modal, props) {
    switch (modal) {
      case "Nutrition":
        this.setState({ ViewNutrition: true, objectValues: props })
        break;
      case "CreateBurger":
        this.setState({ CreateBurger: true })
        break;
      case "EditBurger":
        this.setState({ EditBurger: true, objectValues: props })
        break;
      case "CreateIngredient":
        this.setState({ CreateIngredient: true })
        break;
      case "EditIngredient":
        this.setState({ EditIngredient: true, objectValues: props })
        break;
      default:
    }
  }

  // spawn burger table, or filter ingredients list for specific type
  renderTable(table) {
    if (table === "burger") {
      return <BurgerTable
        table={this.state.burgers}
        deleteItem={this.deleteItem}
        editItem={this.editItem}
        viewModals={this.viewModals}
      />
    } else {
      let i = 0
      let list = []
      for (i = 0; i < this.state.ingredients.length; i++) {
        if (table === this.state.ingredients[i].type) {
          list.push(this.state.ingredients[i])
        }
      }
      return <IngredientTable
        table={list}
        deleteItem={this.deleteItem}
        viewModals={this.viewModals}
      />;
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">

          <button onClick={() => this.restoreSQL()}>Restore SQL Seeds</button>
          <button onClick={() => this.nutritionValue(1)}>Click</button>
          <button onClick={() => this.createItem({
            table: "burger",
            Name: "Placeholder Name",
            ingArr: [1, 3, 5, 3, 2]
          })}>Click</button>

          <div className="d-flex justify-content-around p-2">
            <button onClick={() => this.setState({ table: 'burger' })} >Burger</button>
            <button onClick={() => this.setState({ table: 'Meat' })} >Meat</button>
            <button onClick={() => this.setState({ table: 'Cheese' })} >Cheese</button>
            <button onClick={() => this.setState({ table: 'Bun' })} >Bun</button>
            <button onClick={() => this.setState({ table: 'Vegetable' })} >Vegetable</button>
            <button onClick={() => this.setState({ table: 'Condiment' })} >Condiments</button>
            {/* button to reseed MYSQL if someone edits incorrectly */}
            {/* <button onClick={}>Reset Database</button> */}
          </div>

          {/* the tables themselves */}
          {this.renderTable(this.state.table)}

          {/* each individual model */}
          <ViewBurgerModal
            viewNutrition={this.nutritionValue}
            data={this.state.objectValues}
            show={this.state.ViewNutrition}
            onHide={() => this.setState({ ViewNutrition: false })}
          />

          <EditBurgerModal
            editItem={this.editItem}
            burger={this.state.objectValues}
            ingredients={this.state.ingredients}
            show={this.state.EditBurger}
            onHide={() => this.setState({ EditBurger: false })}
          />

          <CreateBurgerModal
            createItem={this.createItem}
            ingredients={this.state.ingredients}
            show={this.state.CreateBurger}
            onHide={() => this.setState({ CreateBurger: false })}
          />

          <EditIngredientModal
            editItem={this.editItem}
            data={this.state.objectValues}
            show={this.state.EditIngredient}
            onHide={() => this.setState({ EditIngredient: false })}
          />

          <CreateIngredientModal
            createItem={this.createItem}
            type={this.state.table}
            show={this.state.CreateIngredient}
            onHide={() => this.setState({ CreateIngredient: false })}
          />

        </header>
      </div>
    );
  }
}

export default App;