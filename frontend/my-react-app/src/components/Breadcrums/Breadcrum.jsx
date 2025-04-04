import { Link, useLocation } from 'react-router-dom';
import './Breadcrum.css';

const Breadcrumb = ({ product }) => {
    const location = useLocation();

    const getCategoryPath = (category) => {
        // Direct mapping of categories to their routes
        return `/${category.toLowerCase()}`;
    };

    const breadcrumbLinks = [
        { path: '/', label: 'HOME' }
    ];

    if (product) {
        breadcrumbLinks.push(
            { path: getCategoryPath(product.category), label: product.category },
            { path: `/product/${product.id}`, label: product.name }
        );
    }

    return (
        <div className="breadcrumb">
            {breadcrumbLinks.map((link, index) => (
                <span key={link.path} className="breadcrumb-item">
                    {index > 0 && <span className="arrow-icon">›</span>}
                    {index === breadcrumbLinks.length - 1 ? (
                        <span className="current" title={link.label}>{link.label}</span>
                    ) : (
                        <Link to={link.path} title={link.label}>{link.label}</Link>
                    )}
                </span>
            ))}
        </div>
    );
};

export default Breadcrumb;