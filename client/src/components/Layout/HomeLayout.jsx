import React, { useEffect } from "react";
import { Element, scroller } from "react-scroll";
import ClientHome from "../ClientView/Home";
import History from "../ClientView/History";
import { useLocation } from "react-router-dom";

const HomeLayout = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      scroller.scrollTo(location.state.scrollTo, {
        duration: 500,
        smooth: "easeInOutQuart",
        offset: 50,
      });
    }
  }, [location.state]);
  return (
    <div>
      <Element name="home">
        <ClientHome />
      </Element>
      <Element name="history">
        <section>
          <History />
        </section>
      </Element>
    </div>
  );
};

export default HomeLayout;
