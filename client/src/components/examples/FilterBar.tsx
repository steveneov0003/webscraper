import FilterBar from '../FilterBar';
import { useState } from 'react';

export default function FilterBarExample() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <FilterBar 
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      totalCount={12}
      filteredCount={8}
    />
  );
}
