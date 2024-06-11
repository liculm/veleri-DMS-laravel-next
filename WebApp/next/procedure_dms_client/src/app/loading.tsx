import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function Loading()  {
    return (
        <div className="flex justify-center items-center h-screen">
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
    );
};
