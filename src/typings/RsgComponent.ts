import { MethodDescriptor, PropDescriptor, TagProps } from 'react-docgen';
import { ExampleModule } from './RsgExample';
import { RequireItResult } from './RsgRequireItResult';

export type ExpandMode = 'expand' | 'collapse' | 'hide';

export interface BaseComponent {
	hasExamples?: boolean;
	name?: string;
	slug?: string;
	href?: string;
	filepath?: string;
	pathLine?: string;
	description?: string;
	exampleMode?: ExpandMode;
	usageMode?: ExpandMode;
}

export interface Component extends BaseComponent {
	visibleName?: string;
	props?: {
		displayName?: string;
		visibleName?: string;
		description?: string;
		methods?: MethodDescriptor[];
		props?: PropDescriptor[];
		tags?: TagProps;
		examples?: ExampleModule;
	};
	module?: number;
	metadata?: {
		tags?: string[];
	};
}

export interface LoaderComponent extends BaseComponent {
	module: RequireItResult;
	props: RequireItResult;
	metadata: RequireItResult | Record<string, unknown>;
}
