import { Link } from 'react-router-dom';
import styled from 'styled-components';

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const NoStyleLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: none;
  }
`;

export default NoStyleLink;
