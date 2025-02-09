"use client";

import { Advocate } from "@/app/types/advocate";
import { useEffect, useState } from "react";

export default function Page() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expandedSpecialties, setExpandedSpecialties] = useState<Set<number>>(
    new Set()
  );

  const [sortConfig, setSortConfig] = useState({
    key: "lastName",
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetch("/api/advocates")
      .then((response) => response.json())
      .then((jsonResponse) => {
        const fetchedAdvocates = jsonResponse.data;
        setAdvocates(fetchedAdvocates);
  
        const sortedAdvocates = [...fetchedAdvocates].sort((a, b) => {
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];
          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
  
        setFilteredAdvocates(sortedAdvocates);
      })
      .catch(() => setError("Failed to fetch advocates. Please try again later."));
  }, [sortConfig]); 

  const toggleSpecialties = (index: number) => {
    const updated = new Set(expandedSpecialties);
    if (updated.has(index)) {
      updated.delete(index);
    } else {
      updated.add(index);
    }
    setExpandedSpecialties(updated);
  };

  const sortSpecialties = (specialties: string[]) => {
    return specialties.sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  };

  const handleSort = (key: keyof Advocate) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    const sortedAdvocates = [...filteredAdvocates].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredAdvocates(sortedAdvocates);
  };

  const filterForProvider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = advocates.filter(
      (advocate) =>
        [
          advocate.firstName,
          advocate.lastName,
          advocate.city,
          advocate.degree,
          advocate.phoneNumber.toString(),
          advocate.yearsOfExperience.toString(),
        ].some((field) => field.toLowerCase().includes(term)) ||
        advocate.specialties.some((specialty) =>
          specialty.toLowerCase().includes(term)
        )
    );

    setFilteredAdvocates(filtered);
  };

  const onClickReset = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
    setSortConfig({
      key: "lastName",
      direction: "asc",
    });
  };

  const closeError = () => {
    setError(null);
  };

  const indexOfLastAdvocate = currentPage * itemsPerPage;
  const indexOfFirstAdvocate = indexOfLastAdvocate - itemsPerPage;
  const currentAdvocates = filteredAdvocates.slice(
    indexOfFirstAdvocate,
    indexOfLastAdvocate
  );

  const totalPages = Math.ceil(filteredAdvocates.length / itemsPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);

  const getSortIndicator = (columnKey: keyof Advocate) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Solace Advocates
      </h1>

      {error ? (
        <div className="mb-6 p-4 bg-red-100 text-red-800 border border-red-300 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={closeError}
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            aria-label="Close error message"
          >
            Close
          </button>
        </div>
      ) : null}

      <div className="mb-8 bg-gray-100 p-4 rounded-lg shadow">
        <label
          htmlFor="search-input"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Search for Advocates
        </label>
        <div className="flex items-center gap-2">
          <input
            id="search-input"
            className="flex-1 border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-green-300"
            value={searchTerm}
            onChange={filterForProvider}
            placeholder="Type to search..."
            aria-label="Search for advocates"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 hover:bg-green-600 focus:ring focus:ring-green-300"
            onClick={onClickReset}
            aria-label="Reset search"
          >
            Reset
          </button>
        </div>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-200 rounded-lg shadow">
        <thead className="bg-green-500 text-white">
          <tr>
            <th
              className="p-2 border border-green-400 cursor-pointer"
              onClick={() => handleSort("firstName")}
              aria-label="Sort by first name"
              aria-sort={
                sortConfig.key === "firstName"
                  ? sortConfig.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              First Name {getSortIndicator("firstName")}
            </th>
            <th
              className="p-2 border border-green-400 cursor-pointer"
              onClick={() => handleSort("lastName")}
              aria-label="Sort by first name"
              aria-sort={
                sortConfig.key === "lastName"
                  ? sortConfig.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              Last Name {getSortIndicator("lastName")}
            </th>
            <th
              className="p-2 border border-green-400 cursor-pointer"
              onClick={() => handleSort("city")}
              aria-label="Sort by first name"
              aria-sort={
                sortConfig.key === "city"
                  ? sortConfig.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              City {getSortIndicator("city")}
            </th>
            <th
              className="p-2 border border-green-400 cursor-pointer"
              onClick={() => handleSort("degree")}
              aria-label="Sort by first name"
              aria-sort={
                sortConfig.key === "degree"
                  ? sortConfig.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              Degree {getSortIndicator("degree")}
            </th>
            <th className="p-2 border border-green-400">Specialties</th>
            <th
              className="p-2 border border-green-400 cursor-pointer"
              onClick={() => handleSort("yearsOfExperience")}
              aria-label="Sort by first name"
              aria-sort={
                sortConfig.key === "yearsOfExperience"
                  ? sortConfig.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              Years of Experience {getSortIndicator("yearsOfExperience")}
            </th>
            <th className="p-2 border border-green-400">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {currentAdvocates.map((advocate, idx) => (
            <tr
              key={`${advocate.lastName}_${advocate.yearsOfExperience}`}
              className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="p-2 border border-gray-200">
                {advocate.firstName}
              </td>
              <td className="p-2 border border-gray-200">
                {advocate.lastName}
              </td>
              <td className="p-2 border border-gray-200">{advocate.city}</td>
              <td className="p-2 border border-gray-200">{advocate.degree}</td>
              <td className="p-2 border border-gray-200">
                <div>
                  {sortSpecialties(advocate.specialties.slice(0, 1)).map(
                    (specialty) => (
                      <span
                        key={specialty}
                        className="block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 mb-1"
                      >
                        {specialty}
                      </span>
                    )
                  )}
                  {advocate.specialties.length > 1 && (
                    <button
                      onClick={() => toggleSpecialties(idx)}
                      className="text-blue-600 text-xs mt-1"
                      aria-label={
                        expandedSpecialties.has(idx)
                          ? "Show fewer specialties"
                          : "Show more specialties"
                      }
                      role="button"
                    >
                      {expandedSpecialties.has(idx) ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
                {expandedSpecialties.has(idx) && (
                  <div className="mt-2">
                    {sortSpecialties(advocate.specialties.slice(1)).map(
                      (specialty) => (
                        <span
                          key={specialty}
                          className="block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 mb-1"
                        >
                          {specialty}
                        </span>
                      )
                    )}
                  </div>
                )}
              </td>
              <td
                className="p-2 border border-gray-200"
                aria-label="Years of experience"
              >
                {advocate.yearsOfExperience}
              </td>
              <td
                className="p-2 border border-gray-200"
                aria-label={`Phone number: ${
                  advocate.phoneNumber ? advocate.phoneNumber : "N/A"
                }`}
              >
                {advocate.phoneNumber
                  ? `(${advocate.phoneNumber
                      .toString()
                      .slice(0, 3)}) ${advocate.phoneNumber
                      .toString()
                      .slice(3, 6)}-${advocate.phoneNumber.toString().slice(6)}`
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredAdvocates.length > 10 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400"
            aria-label="Go to previous page"
          >
            Prev
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-4 py-2 mx-1 ${
                number === currentPage
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to page ${number}`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400"
            aria-label="Go to next page"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
