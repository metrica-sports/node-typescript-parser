// @ts-nocheck
import { Declaration, getCombinedModifierFlags, ModifierFlags, Node, SyntaxKind, TypeNode } from 'typescript';

import { DeclarationVisibility } from '../declarations/DeclarationVisibility';
import { File } from '../resources/File';
import { Resource } from '../resources/Resource';

/**
 * Checks if the given typescript node has the exported flag.
 * (e.g. export class Foobar).
 *
 * @export
 * @param {Node} node
 * @returns {boolean}
 */
export function isNodeExported(node: Node): boolean {
    const flags = getCombinedModifierFlags(node as Declaration);
    return (flags & ModifierFlags.Export) === ModifierFlags.Export;
}

/**
 * Checks if the given typescript node has the default flag.
 * (e.g. export default class Foobar).
 *
 * @export
 * @param {Node} node
 * @returns {boolean}
 */
export function isNodeDefaultExported(node: Node): boolean {
    const flags = getCombinedModifierFlags(node as Declaration);
    return (flags & ModifierFlags.Default) === ModifierFlags.Default;
}

/**
 * Returns the type text (type information) for a given node.
 *
 * @export
 * @param {(TypeNode | undefined)} node
 * @returns {(string | undefined)}
 */
export function getNodeType(node: TypeNode | undefined): string | undefined {
    return node ? node.getText() : undefined;
}

/**
 * Checks if a node contains a certain modifier (of a given kind)
 *
 * @export
 * @param {Node} node
 * @param {SyntaxKind} modifierKind
 * @returns {boolean}
 */
export function containsModifier(node: Node, modifierKind: SyntaxKind): boolean {
    if (!node.modifiers) return false;
    return node.modifiers.some(mod => mod.kind === modifierKind);
}

/**
 * Returns the enum value (visibility) of a node.
 *
 * @export
 * @param {Node} node
 * @returns {(DeclarationVisibility | undefined)}
 */
export function getNodeVisibility(node: Node): DeclarationVisibility | undefined {
    if (!node.modifiers) {
        return undefined;
    }

    for (const modifier of node.modifiers) {
        switch (modifier.kind) {
            case SyntaxKind.PublicKeyword:
                return DeclarationVisibility.Public;
            case SyntaxKind.ProtectedKeyword:
                return DeclarationVisibility.Protected;
            case SyntaxKind.PrivateKeyword:
                return DeclarationVisibility.Private;
            default:
                break;
        }
    }
}

/**
 * Function that calculates the default name of a resource.
 * This is used when a default export has no name (i.e. export class {}).
 *
 * @export
 * @param {TsResource} resource
 * @returns {string}
 */
export function getDefaultResourceIdentifier(resource: Resource): string {
    if (resource instanceof File && resource.isWorkspaceFile) {
        return resource.parsedPath.name;
    }
    return resource.identifier;
}
