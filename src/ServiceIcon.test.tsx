import React from 'react';
import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import ServiceIcon from './ServiceIcon';
import {serviceIcons} from './serviceIcons';
describe('ServiceIcon',()=>{
 it('renders an honest local generic symbol for an unknown service',()=>{const html=renderToStaticMarkup(<ServiceIcon serviceId="not-an-aws-service" name="Unknown service"/>);expect(html).toContain('service-icon-fallback');expect(html).toContain('Generic service symbol for Unknown service; official service icon unavailable');expect(html).not.toContain('<img');expect(html).not.toContain('src=');});
 it('renders a local official icon without replacing the accessible service identity',()=>{const entry=Object.entries(serviceIcons).find(([,icon])=>icon.kind==='official');expect(entry).toBeDefined();const html=renderToStaticMarkup(<ServiceIcon serviceId={entry![0]} name="Example service" size={48}/>);expect(html).toContain('src="/aws-icons/');expect(html).toContain('draggable="false"');expect(html).toContain('alt="Example service — ');expect(html).toContain('width="48"');});
 it('preserves family and resource mapping distinctions in image labels',()=>{for(const [id,phrase] of [['q-developer','family icon for Q Developer'],['sts','IAM resource icon']]){const html=renderToStaticMarkup(<ServiceIcon serviceId={id} name={id}/>);expect(html).toContain(phrase)}});
});
