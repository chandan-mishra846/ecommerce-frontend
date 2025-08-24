import React from 'react';
import '../componentStyles/pagination.css';

function Pagination({
  currentPage,
  onPageChange,
  totalPages,
  activeClass = 'active',
  firstPageText = 'First',
  lastPageText = 'Last',
}) {
  if (totalPages <= 1) return null;

  const pages = [];

  if (currentPage > 2) {
    pages.push(
      <button key="first" onClick={() => onPageChange(1)} className="pagination-btn">
        {firstPageText}
      </button>
    );
  }

  if (currentPage > 1) {
    pages.push(
      <button key="prev" onClick={() => onPageChange(currentPage - 1)} className="pagination-btn">
        Prev
      </button>
    );
  }

  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`pagination-btn ${currentPage === i ? activeClass : ''}`}
      >
        {i}
      </button>
    );
  }

  if (currentPage < totalPages) {
    pages.push(
      <button key="next" onClick={() => onPageChange(currentPage + 1)} className="pagination-btn">
        Next
      </button>
    );
  }

  if (currentPage < totalPages - 1) {
    pages.push(
      <button key="last" onClick={() => onPageChange(totalPages)} className="pagination-btn">
        {lastPageText}
      </button>
    );
  }

  return <div className="pagination">{pages}</div>;
}

export default Pagination;
