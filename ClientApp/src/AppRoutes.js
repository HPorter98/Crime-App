import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { MapComp } from "./components/MapComp";

const AppRoutes = [
  {
    index: true,
    element: <MapComp />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  }
];

export default AppRoutes;
