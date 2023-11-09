const express = require('express');

module.exports = function(db) {
    const router = express.Router();

    function getAllShoes(callback) {
        const query = 'SELECT shoes_ID, shoes_image_path, shoes_name, shoes_description, shoes_price, shoes_color FROM go_shoes WHERE shoes_quantity > 0';
        db.query(query, callback);
    }

    function getShoeById(shoeId, callback) {
        const query = 'SELECT shoes_ID, shoes_image_path, shoes_name, shoes_description, shoes_price, shoes_color FROM go_shoes WHERE shoes_ID = ?';
        db.query(query, [shoeId], callback);
    }

    // Render index.html
    router.get('/', (request, response) => {
        getAllShoes((error, records) => {
            if (error)
                throw error;
            else
                if (records.length > 0)
                    response.render("index", {products: records});
                else
                    response.status(404).send("Database Empty");
        });
    })

    // Get all products
    router.get('/api/v1/products', (request, response) => {
        getAllShoes((error, records) => {
            if (error)
                throw error;
            else
                if (records.length > 0)
                    response.json({products: records});
                else
                    response.status(404).send("Database Empty");
        });
    });

    // Get a product by id
    router.get('/api/v1/products/:id', (request, response) => {
        getShoeById(request.params.id, (error, record) => {
            if (error) 
                throw error;
            else
                if (record.length > 0)
                    response.json({item: record[0]});
                else
                    response.status(404).send("Product not found");
        });
    });

    // Add item to cart
    router.post('/api/v1/add_to_cart/:id', (request, response) => {
        getShoeById(request.params.id, (error, record) => {
            if (error)
                throw error;
            else
                if (record.length > 0)
                    response.json({
                                    item: {
                                        "shoes_ID": record[0].shoes_ID,
                                        "shoes_image_path": record[0].shoes_image_path,
                                        "shoes_name": record[0].shoes_name,
                                        "shoes_price": record[0].shoes_price,
                                        "shoes_color": record[0].shoes_color,
                                        "buy_quantity": 1,
                    }});
                else
                    response.status(404).send("Product not found");
        })
    });

    // Add a product into database
    router.post('/api/v1/products', (req, res) => {
        
    });

    // Update a product by id
    router.put('/api/v1/products/:id', (req, res) => {
        
    });

    // Delete a product by id
    router.delete('/api/v1/products/:id', (req, res) => {
        
    });

    return router;
};