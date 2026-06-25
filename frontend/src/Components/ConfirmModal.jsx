import React, { useEffect, useState } from 'react';

const ConfirmModal = ({ isOpen, title, subtitle, onConfirm, onCancel, confirmText = "Delete", confirmColor = "#ed4956" }) => {
    const [render, setRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setRender(true);
    }, [isOpen]);

    if (!render) return null;

    return (
        <div 
            className="d-flex justify-content-center align-items-center" 
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100vw', 
                height: '100vh', 
                backgroundColor: 'rgba(0,0,0,0.65)', 
                zIndex: 1050,
                opacity: isOpen ? 1 : 0,
                transition: 'opacity 0.15s ease-in-out'
            }}
            onTransitionEnd={() => { if (!isOpen) setRender(false); }}
            onClick={(e) => { e.stopPropagation(); onCancel && onCancel(); }}
        >
            <div 
                className="bg-white text-center d-flex flex-column" 
                style={{ 
                    width: '400px', 
                    maxWidth: '85vw', 
                    borderRadius: '12px',
                    transform: isOpen ? 'scale(1)' : 'scale(1.05)',
                    transition: 'transform 0.15s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ padding: '32px 16px 16px 16px' }}>
                    <span className="fw-bold" style={{ fontSize: '20px', lineHeight: '24px' }}>{title || "Delete?"}</span>
                    {subtitle && <span className="text-muted mt-2" style={{ fontSize: '14px', lineHeight: '18px' }}>{subtitle}</span>}
                </div>
                <button 
                    className="btn w-100 fw-bold rounded-0" 
                    style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        borderTop: '1px solid #dbdbdb', 
                        height: '48px',
                        fontSize: '14px',
                        color: confirmColor
                    }}
                    onClick={onConfirm}
                >
                    {confirmText}
                </button>
                <button 
                    className="btn w-100 rounded-0" 
                    style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        borderTop: '1px solid #dbdbdb',
                        height: '48px',
                        fontSize: '14px',
                        color: '#000'
                    }}
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConfirmModal;
