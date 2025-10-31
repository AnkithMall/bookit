import { useState, useEffect } from "react";
import ExperienceCard from "../components/ExperienceCard";
import Layout from "../components/Layout";
import type { Experience } from "../data/dummy";
import api from "../lib/api";
import Spinner from "../components/Spinner";

const ExperiencePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await api.get("/experiences");
        setExperiences(response.data);
        setFilteredExperiences(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleSearch = () => {
    const filtered = experiences.filter((experience) =>
      experience.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredExperiences(filtered);
  };

  if (loading) {
    return <Spinner fullScreen label="Loading experiences..." />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSearch={handleSearch}
      searchDisabled={false}
    >
      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExperiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default ExperiencePage;
