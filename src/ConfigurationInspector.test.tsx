import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {it,expect} from 'vitest';
import ConfigurationInspector from './ConfigurationInspector';
import ConfigurationField from './ConfigurationField';
import {configurationFields,configurationDocument} from './configurationRegistry';
it('renders grouped tabs with explicit save/cancel instead of pretending prose is configured IAM',()=>{const html=renderToStaticMarkup(<ConfigurationInspector service="lambda" values={{executionRole:'old role idea'}} onChange={()=>{throw new Error('Render must not save')}}/>);expect(html).toContain('Permissions');expect(html).toContain('Practice');expect(html).toContain('Save configuration');expect(html).toContain('Cancel edits');expect(html).toContain('old role idea');expect(html).toContain('preserved, not asserted')});
it('renders conditional resource pickers and Unknown separately from graph resources',()=>{const field=configurationFields.lambda.find(f=>f.key==='executionRole')!;const html=renderToStaticMarkup(<ConfigurationField field={field} value={undefined} values={configurationDocument().values} onChange={()=>{}} graph={{nodes:[{id:'role-node',service:'iam',label:'Application role'}]}}/>);expect(html).toContain('Application role');expect(html).toContain('Unknown / not linked');expect(html).toContain('External resource reference')});
