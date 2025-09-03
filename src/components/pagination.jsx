import React from 'react';
import '../componentStyles/Pagination.css';

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

  const showPrev = currentPage > 1;
  const showNext = currentPage < totalPages;
  
  // Determine page range to show (only current page and adjacent pages that don't duplicate Prev/Next)
  let start = currentPage;
  let end = currentPage;

  // Add previous page only if we're NOT showing Prev button
  if (currentPage > 1 && !showPrev) {
    start = currentPage - 1;
  }
  
  // Add next page only if we're NOT showing Next button  
  if (currentPage < totalPages && !showNext) {
    end = currentPage + 1;
  }

  // For middle pages, show current page only
  if (showPrev && showNext) {
    start = currentPage;
    end = currentPage;
  }
  
  // For first page, show current and next if no Next button
  if (currentPage === 1 && totalPages > 1) {
    end = showNext ? currentPage : Math.min(currentPage + 1, totalPages);
  }
  
  // For last page, show previous and current if no Prev button
  if (currentPage === totalPages && totalPages > 1) {
    start = showPrev ? currentPage : Math.max(currentPage - 1, 1);
  }

  if (showPrev) {
    pages.push(
      <button key="prev" onClick={() => onPageChange(currentPage - 1)} className="pagination-btn">
        Prev
      </button>
    );
  }

  // Add page numbers
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

  if (showNext) {
    pages.push(
      <button key="next" onClick={() => onPageChange(currentPage + 1)} className="pagination-btn">
        Next
      </button>
    );
  }

  return <div className="pagination">{pages}</div>;
}

export default Pagination;
