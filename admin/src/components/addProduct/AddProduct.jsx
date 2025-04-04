import React, { useState } from "react";
import './AddProduct.css';
import { FiCloud, FiPlus, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { UPLOAD_IMAGE_URL, ADD_PRODUCT_URL } from "../../../Config";
import { categoryData, imageTypesData, colorMap } from "../../../CategoryData";

const STOCK_STATUSES = {
    IN_STOCK: 'IN_STOCK',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
    PREORDER: 'PREORDER',
    BACKORDER: 'BACKORDER'
};

const WARRANTY_COVERAGE_TYPES = {
    MANUFACTURER: 'MANUFACTURER',
    STORE: 'STORE',
    EXTENDED: 'EXTENDED',
    NONE: 'NONE'
};

const AddProduct = () => {
    const [images, setImages] = useState({ main: null });
    const [productDetails, setProductDetails] = useState({
        name: "",
        description: "",
        shortDescription: "",
        category: "phone-accessories",
        subcategory: "",
        image: "", // Main image URL
        new_price: "",
        old_price: "",
        currency: "KSH",
        sizes: [],
        colors: [],
        keyFeatures: [],
        technicalSpecs: {},
        stockStatus: STOCK_STATUSES.IN_STOCK,
        brand: "",
        warranty: {
            hasCoverage: false,
            durationMonths: 0,
            coverageType: WARRANTY_COVERAGE_TYPES.MANUFACTURER
        }
    });

    const [sizeInput, setSizeInput] = useState("");
    const [featureInput, setFeatureInput] = useState("");
    const [specKey, setSpecKey] = useState("");
    const [specValue, setSpecValue] = useState("");
    const [selectedImageType, setSelectedImageType] = useState("main");
    const [isLoading, setIsLoading] = useState(false);

    const getImageTypes = () => {
        return imageTypesData[productDetails.category] || imageTypesData.default;
    };

    const imageHandler = (e, imageType = selectedImageType) => {
        const file = e.target.files[0];
        if (file) {
            setImages(prev => ({ ...prev, [imageType]: file }));
        }
    };
   const getHexCodeForColorName = (colorName) => {
  // Convert to lowercase for case-insensitive matching
  const normalized = colorName.toLowerCase().trim();
  
  // Return the hex code if the color name is in our map
  if (colorMap[normalized]) {
    return colorMap[normalized];
  }
  
  // For unknown colors, generate a simple hash-based color
  // This ensures the same name always produces the same color
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).slice(-2);
  }
  
  return color;
};
    const removeImage = (imageType) => {
        if (imageType === "main") {
            toast.error("Main image cannot be removed");
            return;
        }
        const updatedImages = { ...images };
        delete updatedImages[imageType];
        setImages(updatedImages);
    };

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setProductDetails(prev => ({ ...prev, [name]: value }));
    };

    const addSize = () => {
        if (sizeInput.trim() === "") {
            toast.error("Please enter a valid size.");
            return;
        }
        setProductDetails(prev => ({ ...prev, sizes: [...prev.sizes, sizeInput.trim()] }));
        setSizeInput("");
    };

    const addFeature = () => {
        if (featureInput.trim() === "") {
            toast.error("Please enter a valid feature.");
            return;
        }
        setProductDetails(prev => ({ ...prev, keyFeatures: [...prev.keyFeatures, featureInput.trim()] }));
        setFeatureInput("");
    };

    const addTechnicalSpec = () => {
        if (specKey.trim() === "" || specValue.trim() === "") {
            toast.error("Please enter both specification name and value");
            return;
        }
        setProductDetails(prev => ({
            ...prev,
            technicalSpecs: { ...prev.technicalSpecs, [specKey.trim()]: specValue.trim() }
        }));
        setSpecKey("");
        setSpecValue("");
    };

    const removeTechnicalSpec = (key) => {
        const updatedSpecs = { ...productDetails.technicalSpecs };
        delete updatedSpecs[key];
        setProductDetails(prev => ({ ...prev, technicalSpecs: updatedSpecs }));
    };

    const removeSize = (index) => {
        const updatedSizes = productDetails.sizes.filter((_, i) => i !== index);
        setProductDetails(prev => ({ ...prev, sizes: updatedSizes }));
    };

    const removeFeature = (index) => {
        const updatedFeatures = productDetails.keyFeatures.filter((_, i) => i !== index);
        setProductDetails(prev => ({ ...prev, keyFeatures: updatedFeatures }));
    };
//validate form
    const validateForm = () => {
        if (!productDetails.name || !productDetails.new_price || !productDetails.old_price || !images.main) {
            toast.error("Please fill all required fields and upload a main image");
            return false;
        }
        
        // Make sure prices are valid numbers
        if (isNaN(parseFloat(productDetails.new_price)) || isNaN(parseFloat(productDetails.old_price))) {
            toast.error("Please enter valid numeric values for prices");
            return false;
        }
        
        // Validate warranty duration if warranty coverage is enabled
        if (productDetails.warranty.hasCoverage && isNaN(parseInt(productDetails.warranty.durationMonths))) {
            toast.error("Please enter a valid warranty duration in months");
            return false;
        }
        
        // Check for empty color names
        const emptyColorIndex = productDetails.colors.findIndex(color => color.name.trim() === "");
        if (emptyColorIndex !== -1) {
            toast.error(`Color at position ${emptyColorIndex + 1} has an empty name`);
            return false;
        }
        
        return true;
    };

    const uploadAllImages = async () => {
        const imageUrls = {};
        for (const [imageType, imageFile] of Object.entries(images)) {
            if (!imageFile) continue;
            const formData = new FormData();
            formData.append('product', imageFile);
            try {
                const uploadResponse = await fetch(UPLOAD_IMAGE_URL, {
                    method: 'POST',
                    body: formData,
                });
                if (!uploadResponse.ok) throw new Error(`Upload failed for ${imageType}`);
                const uploadData = await uploadResponse.json();
                if (uploadData.success) imageUrls[imageType] = uploadData.image_url;
            } catch (error) {
                console.error(`Error uploading ${imageType} image:`, error);
                toast.error(`Failed to upload ${imageType} image: ${error.message}`);
                throw error;
            }
        }
        return imageUrls;
    };

    const Add_product = async () => {
        try {
            console.log("Starting product submission...");
            if (!validateForm()) {
                console.log("Form validation failed");
                return;
            }
            
            setIsLoading(true);
            console.log("Beginning image upload process...");
            
            try {
                const imageUrls = await uploadAllImages();
                console.log("Image upload results:", imageUrls);
                
                if (!imageUrls.main) {
                    console.error("Main image upload failed");
                    toast.error("Failed to upload main image");
                    return;
                }
                
                console.log("Creating product data object...");
                const productData = {
                    ...productDetails,
                    image: imageUrls.main,
                    images: Object.values(imageUrls).map(url => ({ url, alt: productDetails.name, type: 'PRIMARY' }))
                };
                
                // Remove any fields that might cause issues
                delete productData.stockUpdateInfo; // Make sure this field is not included
                
                console.log("Product data prepared:", productData);
                
                console.log("Submitting product data to:", ADD_PRODUCT_URL);
                const addProductResponse = await fetch(ADD_PRODUCT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
                console.log("Server response status:", addProductResponse.status);
                
                const addProductData = await addProductResponse.json();
                console.log("Server response data:", addProductData);
                
                if (!addProductResponse.ok) {
                    console.error("Server error details:", addProductData);
                    throw new Error(`Add product failed: ${addProductResponse.statusText}. Details: ${JSON.stringify(addProductData)}`);
                }
                
                if (addProductData.success) {
                    console.log("Product added successfully!");
                    toast.success("Product Added Successfully");
                    setProductDetails({
                        name: "",
                        description: "No description available",
                        shortDescription: "",
                        category: "phone-accessories",
                        subcategory: "",
                        image: "",
                        new_price: "",
                        old_price: "",
                        currency: "USD",
                        sizes: [],
                        colors: [],
                        keyFeatures: [],
                        technicalSpecs: {},
                        stockStatus: STOCK_STATUSES.IN_STOCK,
                        brand: "",
                        warranty: {
                            hasCoverage: false,
                            durationMonths: 0,
                            coverageType: WARRANTY_COVERAGE_TYPES.MANUFACTURER
                        }
                    });
                    setImages({ main: null });
                } else {
                    console.error("Product addition failed with success:false:", addProductData);
                    toast.error(addProductData.error || "Failed to add product");
                }
            } catch (uploadError) {
                console.error("Error in image upload process:", uploadError);
                throw new Error(`Image upload or processing error: ${uploadError.message}`);
            }
        } catch (error) {
            console.error('Error in Add_product:', error);
            console.error('Error stack:', error.stack);
            toast.error(`Error: ${error.message}`);
        } finally {
            console.log("Finalizing add product operation");
            setIsLoading(false);
        }
    };
    const imageTypes = getImageTypes();

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <h1>Add New Product</h1>
            </div>
            <div className="addproduct">
                {/* Product Name */}
                <div className="addproductitemfield">
                    <p>Product Title</p>
                    <input
                        value={productDetails.name}
                        onChange={changeHandler}
                        type="text"
                        name="name"
                        placeholder="Type here"
                        required
                    />
                </div>

                {/* Description */}
                <div className="addproductitemfield">
                    <p>Description</p>
                    <textarea
                        value={productDetails.description}
                        onChange={changeHandler}
                        name="description"
                        placeholder="Product description"
                        rows="4"
                        required
                    />
                </div>

                {/* Short Description */}
                <div className="addproductitemfield">
                    <p>Short Description</p>
                    <input
                        value={productDetails.shortDescription}
                        onChange={changeHandler}
                        type="text"
                        name="shortDescription"
                        placeholder="Short description (max 160 characters)"
                        maxLength="160"
                    />
                </div>

                {/* Category and Subcategory */}
                <div className="addproductitemfield">
                    <p>Category</p>
                    <select
                        value={productDetails.category}
                        onChange={changeHandler}
                        name="category"
                    >
                        {Object.keys(categoryData).map((category) => (
                            <option key={category} value={category}>
                                {category.replace(/-/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="addproductitemfield">
                    <p>Subcategory</p>
                    <select
                        value={productDetails.subcategory}
                        onChange={changeHandler}
                        name="subcategory"
                    >
                        <option value="">Select Subcategory</option>
                        {categoryData[productDetails.category]?.map((subcategory) => (
                            <option key={subcategory} value={subcategory}>
                                {subcategory}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price and Offer Price */}
                <div className="addproduct-price">
                    <div className="addproductitemfield">
                        <p>Price</p>
                        <input
                            value={productDetails.old_price}
                            onChange={changeHandler}
                            type="number"
                            name="old_price"
                            placeholder="Original price"
                            min="0"
                            required
                        />
                    </div>
                    <div className="addproductitemfield">
                        <p>Offer Price</p>
                        <input
                            value={productDetails.new_price}
                            onChange={changeHandler}
                            type="number"
                            name="new_price"
                            placeholder="Discounted price"
                            min="0"
                            required
                        />
                    </div>
                </div>

                {/* Currency */}
                <div className="addproductitemfield">
                    <p>Currency</p>
                    <input
                        value={productDetails.currency}
                        onChange={changeHandler}
                        type="text"
                        name="currency"
                        placeholder="Currency (e.g., USD)"
                    />
                </div>

                {/* Sizes */}
                <div className="addproductitemfield">
                    <p>Sizes</p>
                    <div className="sizes-container">
                        <input
                            type="text"
                            value={sizeInput}
                            onChange={(e) => setSizeInput(e.target.value)}
                            placeholder="Add size (e.g., 24-inch)"
                        />
                        <button onClick={addSize} className="add-size-btn">
                            Add Size
                        </button>
                    </div>
                    <div className="sizes-list">
                        {productDetails.sizes.map((size, index) => (
                            <div key={index} className="size-item">
                                <span>{size}</span>
                                <button onClick={() => removeSize(index)} className="remove-size-btn">
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

              {/* Colors */}
<div className="addproductitemfield">
    <p>Colors</p>
    <div className="colors-container">
        {productDetails.colors.map((color, index) => (
            <div key={index} className="color-item">
                <input
                    type="color"
                    value={color.hexCode}
                    onChange={(e) => {
                        const updatedColors = [...productDetails.colors];
                        updatedColors[index].hexCode = e.target.value;
                        setProductDetails(prev => ({ ...prev, colors: updatedColors }));
                    }}
                />
                <input
                    type="text"
                    value={color.name}
                    onChange={(e) => {
                        const updatedColors = [...productDetails.colors];
                        updatedColors[index].name = e.target.value;
                        // Auto-generate hex code based on color name
                        if (e.target.value.trim() !== "") {
                            updatedColors[index].hexCode = getHexCodeForColorName(e.target.value);
                        }
                        setProductDetails(prev => ({ ...prev, colors: updatedColors }));
                    }}
                    placeholder="Color name"
                />
                <button onClick={() => {
                    const updatedColors = productDetails.colors.filter((_, i) => i !== index);
                    setProductDetails(prev => ({ ...prev, colors: updatedColors }));
                }} className="remove-color-btn">
                    ×
                </button>
            </div>
        ))}
        <button
            onClick={() => {
                setProductDetails(prev => ({
                    ...prev,
                    colors: [...prev.colors, { name: "Black", hexCode: "#000000" }]
                }));
            }}
            className="add-color-btn"
        >
            Add Color
        </button>
    </div>
</div>
                {/* Key Features */}
                <div className="addproductitemfield">
                    <p>Key Features</p>
                    <div className="features-container">
                        <input
                            type="text"
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            placeholder="Add feature (e.g., 4K Display)"
                        />
                        <button onClick={addFeature} className="add-feature-btn">
                            Add Feature
                        </button>
                    </div>
                    <div className="features-list">
                        {productDetails.keyFeatures.map((feature, index) => (
                            <div key={index} className="feature-item">
                                <span>{feature}</span>
                                <button onClick={() => removeFeature(index)} className="remove-feature-btn">
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technical Specifications */}
                <div className="addproductitemfield">
                    <p>Technical Specifications</p>
                    <div className="specs-container">
                        <div className="specs-input-group">
                            <input
                                type="text"
                                value={specKey}
                                onChange={(e) => setSpecKey(e.target.value)}
                                placeholder="Specification name (e.g., Processor)"
                            />
                            <input
                                type="text"
                                value={specValue}
                                onChange={(e) => setSpecValue(e.target.value)}
                                placeholder="Value (e.g., Intel Core i7)"
                            />
                            <button onClick={addTechnicalSpec} className="add-spec-btn">
                                Add Spec
                            </button>
                        </div>
                    </div>
                    <div className="specs-list">
                        {Object.entries(productDetails.technicalSpecs).map(([key, value], index) => (
                            <div key={index} className="spec-item">
                                <span className="spec-name">{key}:</span>
                                <span className="spec-value">{value}</span>
                                <button onClick={() => removeTechnicalSpec(key)} className="remove-spec-btn">
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Brand */}
                <div className="addproductitemfield">
                    <p>Brand</p>
                    <input
                        value={productDetails.brand}
                        onChange={changeHandler}
                        type="text"
                        name="brand"
                        placeholder="Brand name"
                    />
                </div>

                {/* Warranty */}
                <div className="addproductitemfield">
                    <p>Warranty</p>
                    <div className="warranty-container">
                        <label>
                            <input
                                type="checkbox"
                                checked={productDetails.warranty.hasCoverage}
                                onChange={(e) => {
                                    setProductDetails(prev => ({
                                        ...prev,
                                        warranty: { ...prev.warranty, hasCoverage: e.target.checked }
                                    }));
                                }}
                            />
                            Has Warranty Coverage
                        </label>
                        <input
                            type="number"
                            value={productDetails.warranty.durationMonths}
                            onChange={(e) => {
                                setProductDetails(prev => ({
                                    ...prev,
                                    warranty: { ...prev.warranty, durationMonths: parseInt(e.target.value) }
                                }));
                            }}
                            placeholder="Duration (months)"
                            min="0"
                        />
                        <select
                            value={productDetails.warranty.coverageType}
                            onChange={(e) => {
                                setProductDetails(prev => ({
                                    ...prev,
                                    warranty: { ...prev.warranty, coverageType: e.target.value }
                                }));
                            }}
                        >
                            <option value="MANUFACTURER">Manufacturer</option>
                            <option value="STORE">Store</option>
                            <option value="EXTENDED">Extended</option>
                            <option value="NONE">None</option>
                        </select>
                    </div>
                </div>

                {/* Multi-Image Upload Section */}
                <div className="addproductitemfield">
                    <p>Product Images</p>
                    <div className="image-upload-container">
                        <div className="uploaded-images-grid">
                            {Object.entries(images).map(([type, file]) => file && (
                                <div key={type} className="image-preview-container">
                                    <div className="image-type-label">{imageTypes.find(t => t.value === type)?.label || type}</div>
                                    <img src={URL.createObjectURL(file)} alt={`${type} view`} className="image-preview" />
                                    <button onClick={() => removeImage(type)} className="remove-image-btn" disabled={type === "main"}>
                                        <FiX />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="add-image-container">
                            <div className="image-upload-controls">
                                <select value={selectedImageType} onChange={(e) => setSelectedImageType(e.target.value)} className="image-type-selector">
                                    {imageTypes
                                        .filter(type => !images[type.value])
                                        .map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                </select>
                                <label htmlFor="new-image-input" className="add-image-label">
                                    <div className="upload-placeholder">
                                        <FiPlus size={20} />
                                        <span>Add Image</span>
                                    </div>
                                </label>
                                <input id="new-image-input" type="file" onChange={(e) => imageHandler(e)} accept="image/*" hidden />
                            </div>
                        </div>
                        <div className="image-upload-note">
                            <p>* Main image is required. Additional views are recommended for electronics and appliances.</p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button onClick={Add_product} className="addproductbtn" disabled={!productDetails.name || !images.main || isLoading}>
                    {isLoading ? "Adding Product..." : "ADD PRODUCT"}
                </button>
            </div>
        </div>
    );
};

export default AddProduct;