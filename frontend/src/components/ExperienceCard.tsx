import { Link } from "react-router-dom";
import type { Experience } from "../data/dummy";
import { Button } from "./ui/button";

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <img
        src={experience.image}
        alt={experience.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{experience.name}</h2>
          <p className="text-gray-500">{experience.location}</p>
        </div>
        <p className="text-gray-700 mt-2 truncate">{experience.description}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-bold">From ₹{experience.price}</p>
          <Link to={`/details/${experience.id}`}>
            <Button
              style={{
                backgroundColor: "#FFD643",
                color: "#161616",
                borderRadius: "8px",
              }}
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
