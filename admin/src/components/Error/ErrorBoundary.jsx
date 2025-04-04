import React from 'react';
import { useNavigate } from 'react-router-dom';

// Wrapper component to provide navigation functionality to class component
const ErrorBoundaryWrapper = (props) => {
  const navigate = useNavigate();
  return <ErrorBoundaryClass navigate={navigate} {...props} />;
};

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Reset error state after 5 seconds and redirect to home
    setTimeout(() => {
      this.setState({ hasError: false, error: null, errorInfo: null });
      if (this.props.navigate) {
        this.props.navigate('/admin');
      }
    }, 5000);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.navigate) {
      this.props.navigate('/admin');
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Oops! Something went wrong
              </h2>
              <div className="mb-4 text-gray-600">
                We encountered an unexpected error. The page will automatically reload in 5 seconds.
              </div>
              
              <button
                onClick={this.handleRestart}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Restart Now
              </button>
              
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details
                </summary>
                <div className="mt-2 p-4 bg-gray-50 rounded text-xs font-mono whitespace-pre-wrap text-gray-700">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </div>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWrapper;