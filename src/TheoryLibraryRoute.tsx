import type {ComponentProps} from 'react';
import TheoryIndex from './TheoryIndex';
import {chapters} from './content';
import {readReaderState} from './readerState';

type Props=Omit<ComponentProps<typeof TheoryIndex>,'chapters'|'continueAt'>;
export default function TheoryLibraryRoute(props:Props) {
 return <TheoryIndex {...props} chapters={chapters} continueAt={readReaderState(localStorage).positions[props.exam]}/>;
}
