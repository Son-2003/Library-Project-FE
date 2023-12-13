import Carousel from "./component/Carousel";
import ExploreTopBooks from "./component/ExploreTopBooks";
import Heros from "./component/Heros";
import LibraryServices from "./component/LibraryServices";

const HomePage = () => {
  return (
    <div>
      <ExploreTopBooks />
      <Carousel />
      <Heros />
      <LibraryServices />
    </div>
  );
};
export default HomePage;
