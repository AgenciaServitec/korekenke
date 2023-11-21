import { useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useNavigate } from "react-router";

export const useQueriesState = (initialObject) => {
  const location = useLocation();
  const navigate = useNavigate();

  const queriesToState = (object) => {
    const urlQuery = queryString.parse(location.search, {
      parseBooleans: true,
      parseNumbers: true,
    });

    const queryValues = {};

    Object.entries(object).forEach(([key, value]) => {
      const urlQueryValue = urlQuery[key];

      queryValues[key] = urlQueryValue || value;
    });

    return { ...object, ...queryValues };
  };

  const [object, setObject] = useState(queriesToState(initialObject));

  const syncQueryWithState = (newObject) => {
    const newQuery = new URLSearchParams();

    Object.entries(newObject).forEach(([key, value]) => {
      value && newQuery.set(key, value.toString());
    });

    navigate(`${window.location.pathname}?${newQuery}`);

    setObject(newObject);
  };

  return [object, syncQueryWithState];
};
