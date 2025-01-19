import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const DataTable = ({ 
  data, 
  columns, 
  title,
  actions,
  onRowClick,
  searchable = true 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    if (searchTerm) {
      sortableData = sortableData.filter(item => 
        columns.some(column => 
          String(item[column.key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return sortableData;
  }, [data, sortConfig, searchTerm, columns]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <Typography>{title}</Typography>
        {searchable && (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Szukaj..."
              className="pl-8 p-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="p-2 text-left border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {sortConfig.key === column.key && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th className="p-2 text-left border-b">Akcje</th>}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr 
                  key={index}
                  className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="p-2 border-b">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="p-2 border-b">
                      <div className="flex gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;