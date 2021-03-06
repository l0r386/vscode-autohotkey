import * as vscode from "vscode";
import { Detecter } from "../core/Detecter";

export function getSymbolForLine(document: vscode.TextDocument, line: number): vscode.SymbolInformation {

    const method = Detecter.getMethodByLine(document, line);
    if (method) {
        return new vscode.SymbolInformation(method.full, vscode.SymbolKind.Method, method.comnent, new vscode.Location(document.uri, new vscode.Position(line, 0)));
    }

    const {text} = document.lineAt(line);
    const hotKeyMatch = text.match(/;;(.+)/);
    if (hotKeyMatch) {
        return new vscode.SymbolInformation(hotKeyMatch[1], vscode.SymbolKind.Module, null, new vscode.Location(document.uri, new vscode.Position(line, 0)));
    }

}

export class SymBolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        const lineCount = Math.min(document.lineCount, 10000);
        const result: vscode.SymbolInformation[] = [];
        for (let line = 0; line < lineCount; line++) {
            const symbol = getSymbolForLine(document, line);
            if (symbol) {
                result.push(symbol);
            }
        }
        return result;
    }

}
