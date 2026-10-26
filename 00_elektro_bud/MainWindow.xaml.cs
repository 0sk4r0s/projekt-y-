using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace ElektroBud
{
    public class Product
    {
        public int Id { get; set; }
        public string Ean { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string Sector { get; set; } = string.Empty;
        public string Rack { get; set; } = string.Empty;
        public string Shelf { get; set; } = string.Empty;
        public string FullLocation => $"{Sector} / {Rack} / {Shelf}";
    }

    public partial class MainWindow : Window
    {
        private readonly List<Product> products = new List<Product>();
        private int nextId = 4;
        private int? editedProductId = null;

        public MainWindow()
        {
            InitializeComponent();
            SeedInitialData();
            RefreshProductList();
        }

        private void SeedInitialData()
        {
            products.Add(new Product
            {
                Id = 1,
                Ean = "5901234567890",
                Name = "Przewód instalacyjny YDYp 3x1,5 100m",
                Category = "Kable i przewody",
                Quantity = 32,
                Sector = "A",
                Rack = "R01",
                Shelf = "P2"
            });

            products.Add(new Product
            {
                Id = 2,
                Ean = "5909876543210",
                Name = "Wyłącznik nadprądowy B16 1P",
                Category = "Aparatura modułowa",
                Quantity = 120,
                Sector = "B",
                Rack = "R04",
                Shelf = "P1"
            });

            products.Add(new Product
            {
                Id = 3,
                Ean = "5901122334455",
                Name = "Zaprawa klejowa elastyczna 25kg",
                Category = "Materiały budowlane",
                Quantity = 48,
                Sector = "C",
                Rack = "R10",
                Shelf = "P0"
            });
        }

        private void RefreshProductList()
        {
            string query = SearchTextBox.Text.Trim().ToLower();

            if (string.IsNullOrEmpty(query))
            {
                ProductsDataGrid.ItemsSource = products.ToList();
                return;
            }

            ProductsDataGrid.ItemsSource = products
                .Where(p => p.Ean.ToLower().Contains(query) || p.Name.ToLower().Contains(query))
                .ToList();
        }

        private bool TryValidateInputs(out string ean, out string name, out string category, out int quantity, out string sector, out string rack, out string shelf)
        {
            ean = EanTextBox.Text.Trim();
            name = NameTextBox.Text.Trim();
            category = (CategoryComboBox.SelectedItem as ComboBoxItem)?.Content?.ToString() ?? string.Empty;
            sector = SectorTextBox.Text.Trim().ToUpper();
            rack = RackTextBox.Text.Trim().ToUpper();
            shelf = ShelfTextBox.Text.Trim().ToUpper();
            quantity = 0;

            if (string.IsNullOrEmpty(ean) || ean.Length < 8 || ean.Length > 13 || !ean.All(char.IsDigit))
            {
                MessageBox.Show("Kod EAN musi składać się wyłącznie z cyfr (od 8 do 13 znaków).", "Błędne dane", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }

            if (string.IsNullOrEmpty(name))
            {
                MessageBox.Show("Podaj nazwę produktu.", "Błędne dane", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }

            if (string.IsNullOrEmpty(category))
            {
                MessageBox.Show("Wybierz kategorię produktu.", "Błędne dane", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }

            if (!int.TryParse(QuantityTextBox.Text.Trim(), out quantity) || quantity < 0)
            {
                MessageBox.Show("Ilość musi być liczbą całkowitą większą lub równą 0.", "Błędne dane", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }

            if (string.IsNullOrEmpty(sector) || string.IsNullOrEmpty(rack) || string.IsNullOrEmpty(shelf))
            {
                MessageBox.Show("Uzupełnij pełną lokalizację produktu (Sektor, Regał, Półka).", "Błędne dane", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }

            bool duplicateEan = products.Any(p => p.Ean == ean && p.Id != editedProductId);
            if (duplicateEan)
            {
                MessageBox.Show("Produkt o podanym kodzie EAN już istnieje w magazynie.", "Błędne dane", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }

            return true;
        }

        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            if (!TryValidateInputs(out string ean, out string name, out string category, out int quantity, out string sector, out string rack, out string shelf))
            {
                return;
            }

            if (editedProductId == null)
            {
                products.Add(new Product
                {
                    Id = nextId++,
                    Ean = ean,
                    Name = name,
                    Category = category,
                    Quantity = quantity,
                    Sector = sector,
                    Rack = rack,
                    Shelf = shelf
                });
            }
            else
            {
                Product? product = products.FirstOrDefault(p => p.Id == editedProductId.Value);
                if (product != null)
                {
                    product.Ean = ean;
                    product.Name = name;
                    product.Category = category;
                    product.Quantity = quantity;
                    product.Sector = sector;
                    product.Rack = rack;
                    product.Shelf = shelf;
                }
            }

            ResetForm();
            RefreshProductList();
        }

        private void EditButton_Click(object sender, RoutedEventArgs e)
        {
            if (ProductsDataGrid.SelectedItem is not Product selectedProduct)
            {
                MessageBox.Show("Zaznacz produkt na liście, który chcesz edytować.", "Brak zaznaczenia", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            editedProductId = selectedProduct.Id;
            EanTextBox.Text = selectedProduct.Ean;
            NameTextBox.Text = selectedProduct.Name;
            QuantityTextBox.Text = selectedProduct.Quantity.ToString();
            SectorTextBox.Text = selectedProduct.Sector;
            RackTextBox.Text = selectedProduct.Rack;
            ShelfTextBox.Text = selectedProduct.Shelf;

            foreach (ComboBoxItem item in CategoryComboBox.Items)
            {
                if (item.Content?.ToString() == selectedProduct.Category)
                {
                    CategoryComboBox.SelectedItem = item;
                    break;
                }
            }

            FormHeaderText.Text = $"Edycja produktu #{selectedProduct.Id} (EAN: {selectedProduct.Ean})";
            SaveButton.Content = "Zapisz zmiany";
            CancelButton.Visibility = Visibility.Visible;
        }

        private void DeleteButton_Click(object sender, RoutedEventArgs e)
        {
            if (ProductsDataGrid.SelectedItem is not Product selectedProduct)
            {
                MessageBox.Show("Zaznacz produkt na liście, który chcesz usunąć.", "Brak zaznaczenia", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            MessageBoxResult result = MessageBox.Show(
                $"Czy na pewno chcesz usunąć produkt \"{selectedProduct.Name}\"?",
                "Potwierdzenie usunięcia",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (result == MessageBoxResult.Yes)
            {
                products.Remove(selectedProduct);
                if (editedProductId == selectedProduct.Id)
                {
                    ResetForm();
                }
                RefreshProductList();
            }
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            ResetForm();
        }

        private void SearchTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            RefreshProductList();
        }

        private void ResetForm()
        {
            editedProductId = null;
            EanTextBox.Clear();
            NameTextBox.Clear();
            CategoryComboBox.SelectedIndex = 0;
            QuantityTextBox.Clear();
            SectorTextBox.Clear();
            RackTextBox.Clear();
            ShelfTextBox.Clear();

            FormHeaderText.Text = "Dodaj nowy produkt";
            SaveButton.Content = "Dodaj produkt";
            CancelButton.Visibility = Visibility.Collapsed;
        }
    }
}