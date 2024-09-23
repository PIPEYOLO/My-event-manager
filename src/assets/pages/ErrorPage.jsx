import { useMemo } from "react";
import { Link } from "react-router-dom";



export default function ErrorPage({ error }){

  return (
    <div className="h-full w-full flex items-center justify-center bg-1">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-2 mb-4">{ error.status }</h1>
        <p className="text-lg text-gray-400 mb-8">
          <span className="capitalize">{ error.message }</span>
        </p>
        <Link to="/">
          Go to Home
        </Link>
      </div>
    </div>
  );
};