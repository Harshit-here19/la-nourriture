import React, { useState, useEffect } from "react";
import Card from "../UI/Card";

import classes from "./AvailableMeals.module.css";
import MealItem from "./MealItem/MealItem";

const AvailableMeals = () => {
  const [MEALS, setMEALS] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState();

  const fetchMeals = async () => {
    try {
      const response = await fetch(
        "https://la-nourriture-5750d-default-rtdb.firebaseio.com/meals.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!!!");
      }

      const data = await response.json();

      const loadedMeals = [];

      for (const key in data) {
        loadedMeals.push({
          id: key,
          name: data[key].name,
          description: data[key].description,
          price: data[key].price,
        });
      }

      setMEALS(loadedMeals);
    } catch (error) {
      setErrors(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  if (isLoading) {
    return;
    <section className={classes.mealsLoading}>
      <p>Loading...</p>;
    </section>;
  }

  if (errors) {
    return (
      <section className={classes.mealsError}>
        <p>{errors}</p>
      </section>
    );
  }

  const mealsList = MEALS.map((meal) => <MealItem key={meal.id} item={meal} />);

  return (
    <section className={classes.meals}>
      {!isLoading && MEALS.length !== 0 && (
        <Card>
          <ul>{mealsList}</ul>
        </Card>
      )}
    </section>
  );
};

export default AvailableMeals;
