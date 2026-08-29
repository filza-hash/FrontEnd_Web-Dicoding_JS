/**
 * Class yang merepresentasikan inventaris barang.
 */
class Inventory {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  listItems() {
    return this.items.map((item) => item.displayDetails()).join('\n');
  }
}

// Jangan hapus kode di bawah ini!
export default Inventory;
