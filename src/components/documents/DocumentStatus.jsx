import React from 'react';
import Badge from '../ui/Badge';
import { DOCUMENT_STATUS } from '../../utils/constants';

export default function DocumentStatus({ status = 'ready', size = 'sm' }) {
  const normalized = (status || '').toLowerCase();

  if (normalized === DOCUMENT_STATUS.PROCESSING || normalized === 'pending') {
    return (
      <Badge variant="warning" size={size} dot className="animate-pulse">
        Processing
      </Badge>
    );
  }

  if (normalized === DOCUMENT_STATUS.FAILED || normalized === 'error') {
    return (
      <Badge variant="error" size={size} dot>
        Failed
      </Badge>
    );
  }

  return (
    <Badge variant="success" size={size} dot>
      Ready
    </Badge>
  );
}
