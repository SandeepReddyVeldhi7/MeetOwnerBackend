import axios from 'axios';

//dummy apis
export const getAllProducts = async (req, res) => {
  try {
    const { data } = await axios.get('https://dummyjson.com/products');
  
    res.status(200).json(data.products); 
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`https://dummyjson.com/products/${id}`);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: 'Product not found', error });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const { data } = await axios.get('https://dummyjson.com/products');
    const filtered = data.products
      .filter(p => p.title.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 5);
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error });
  }
};
